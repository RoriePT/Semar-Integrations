import { useEffect, useState } from "react";
import { Drawer } from "@mantine/core";
import {
  ReactFlow,
  ConnectionLineType,
  Background,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import dagre from "dagre";
import CustomNode from "./Node";
import CommonAPIs from "../../api/common";
import "./styles.css";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 472;
const nodeHeight = 222;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const isHorizontal = direction === "LR";
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: newNodes, edges };
};

const MemberTree = ({ opened, close, selectedRow }) => {
  const [layoutedNodes, setLayoutedNodes] = useState([]);
  const [layoutedEdges, setLayoutedEdges] = useState([]);

  const fetchReferralTreeData = async () => {
    const data = await CommonAPIs.getMemberReferralsTree();
    if (data) {
      generateNodesAndEdges(data);
    }
  };

  const generateNodesAndEdges = (data) => {
    const nodes = [];
    const edges = [];

    const createNode = (member, parentId = null) => {
      const nodeId = member.id.toString();
      const currentNode = selectedRow.referredMember.id === member.id;

      nodes.push({
        id: nodeId,
        type: "customNode",
        position: { x: 0, y: 0 },
        data: {
          value: member.id,
          isRootNode: parentId === null,
          isLeafNode: member.children.length === 0,
          name: `${member.firstName} ${member.lastName}`,
          payinCommission: member.payinCommission,
          payoutCommission: member.payoutCommission,
          topupCommission: member.topupCommission,
          referredMemberPayinCommission: member.referredMemberPayinCommission,
          referredMemberPayoutCommission: member.referredMemberPayoutCommission,
          referredMemberTopupCommission: member.referredMemberTopupCommission,
          currentNode,
          email: member.email,
        },
      });

      if (parentId) {
        edges.push({
          id: `e${parentId}-${nodeId}`,
          source: parentId,
          target: nodeId,
          type: "smoothstep",
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 10,
            height: 10,
            color: "#2a2a2a",
          },
          style: {
            strokeWidth: 2,
            stroke: "#2a2a2a",
          },
        });
      }

      member.children.forEach((child) => createNode(child, nodeId));
    };

    createNode(data);

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );

    setLayoutedNodes(layoutedNodes);
    setLayoutedEdges(layoutedEdges);
  };

  useEffect(() => {
    if (opened) {
      fetchReferralTreeData();
    }
  }, [opened]);

  return (
    <Drawer
      opened={opened}
      onClose={close}
      size={"100%"}
      withCloseButton={true}
      title={
        "Referral Tree: " +
        selectedRow?.referredMember?.firstName +
        " " +
        selectedRow?.referredMember?.lastName
      }
    >
      <ReactFlow
        nodeTypes={{ customNode: CustomNode }}
        nodes={layoutedNodes}
        edges={layoutedEdges}
        fitView
        connectionLineType={ConnectionLineType.Step}
        nodesConnectable={false}
        nodesDraggable={false}
      >
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </Drawer>
  );
};

export default MemberTree;
