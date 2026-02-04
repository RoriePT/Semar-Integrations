import { useEffect, useState } from "react";
import { Drawer, Flex, Paper, Text } from "@mantine/core";
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
import { useDisclosure } from "@mantine/hooks";
import { useDashboardUser } from "../../pages/Dashboard/DashboardProvider";

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const nodeWidth = 472;
const nodeHeight = 222;

function isDescendant(loggedInNodeId, targetNodeId, tree) {
  if (!tree || tree.length === 0) return;
  // Helper function to find a node by ID recursively
  function findNodeById(nodeId, node) {
    if (node.id === nodeId) return node;
    //if(!Array.isArray(node.children)) return node;
    for (let child of node.children) {
      const found = findNodeById(nodeId, child);
      if (found) return found;
    }
    return null;
  }

  // Helper function to check if a node contains the targetNodeId
  function hasDescendant(node, targetNodeId) {
    for (let child of node.children) {
      if (child.id === targetNodeId || hasDescendant(child, targetNodeId)) {
        return true;
      }
    }
    return false;
  }

  // Find the loggedInNode in the tree

  const loggedInNode = findNodeById(loggedInNodeId, tree);
  if (!loggedInNode) {
    // throw new Error("Logged-in node not found in the tree.");
    return null;
  }

  // Check if the loggedInNode contains the targetNodeId as a descendant
  return hasDescendant(loggedInNode, targetNodeId);
}

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

const OrganisationTree = ({ selectedRow }) => {
  const [layoutedNodes, setLayoutedNodes] = useState([]);
  const [layoutedEdges, setLayoutedEdges] = useState([]);
  const [reload, setReload] = useState(false);
  const [opened, handlers] = useState(false);

  const { userData } = useDashboardUser();

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
          quota: member.quota,
          reload: triggerReload,
          isDescendant: isDescendant(userData?.id, member.id, data),
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
    fetchReferralTreeData();
  }, [selectedRow, reload]);

  const triggerReload = () => {
    setReload((value) => !value);
  };

  return (
    <Paper style={{ height: "100%", width: "100%" }}>
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
    </Paper>
  );
};

export default OrganisationTree;
