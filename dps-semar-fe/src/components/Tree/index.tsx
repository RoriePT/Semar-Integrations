import { useEffect, useState } from "react";
import { Button, Drawer, Flex, Text } from "@mantine/core";
import {
  ReactFlow,
  ConnectionLineType,
  Background,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react";
import dagre from "dagre";

import CommonAPIs from "../../api/common";
import "./styles.css";
import MemberNode from "./MemberNode";
import AgentNode from "./AgentNode";
import { useDashboardUser } from "../../pages/Dashboard/DashboardProvider";
import EditRateModal from "../EditRateModalTeam";
import { useDisclosure } from "@mantine/hooks";
import EditRateModalTeam from "../EditRateModalTeam";

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

const Tree = ({ opened, close, type, forUser, teamId }) => {
  const [layoutedNodes, setLayoutedNodes] = useState([]);
  const [layoutedEdges, setLayoutedEdges] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [openedEditModal, handlerEditModal] = useDisclosure();

  const [reload, setReload] = useState(false);
  const triggerReload = () => setReload((prev) => !prev);

  const { userData } = useDashboardUser();

  const [treeData, setTreeData] = useState(null);

  const handleSelectedNodes = (node) => {
    setSelectedNodes((prev) => {
      const nodeExists = prev.find((n) => n.nodeId === node.nodeId);
      if (nodeExists) {
        return prev.filter((n) => n.nodeId !== node.nodeId);
      } else {
        return [...prev, node];
      }
    });
  };

  const fetchReferralTreeData = async () => {
    const data =
      type === "members"
        ? await CommonAPIs.getTeamTree(teamId)
        : await CommonAPIs.getOrganizationTree(teamId);

    const currentLoggedinUserEmail = userData?.email;

    const findUserNode = (node, email) => {
      if (node.email === email) return node;

      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const result = findUserNode(child, email);
          if (result) return result;
        }
      }
      return null;
    };
    console.log({ forUser });
    if (!forUser) {
      setTreeData(data);
      generateNodesAndEdges(data.tree, data.id);
    } else {
      const userNode = findUserNode(data.tree, currentLoggedinUserEmail);

      if (userNode) {
        const newTreeData = {
          ...data,
          tree: userNode,
        };
        setTreeData(newTreeData);
        generateNodesAndEdges(userNode, data.id);
      } else {
        setTreeData(data);
        generateNodesAndEdges(data.tree, data.id);
      }
    }
  };

  const generateNodesAndEdges = (data, teamId) => {
    const nodes = [];
    const edges = [];

    const getNodeId = (node) => {
      if (type === "members") return "member" + node.id;
      if (node.isAgent) return "agent" + node.id;

      return "merchant" + node.id;
    };

    const createNode = (node, parentId = null, parentName = "") => {
      let nodeId = getNodeId(node);

      nodes.push({
        id: nodeId,
        type: type === "members" ? "memberNode" : "agentNode",
        position: { x: 0, y: 0 },
        data: {
          id: node.id,
          nodeId,
          teamId: teamId,
          isRootNode: parentId === null,
          isLeafNode: node.children?.length < 1,
          name: node.name,
          email: node.email,
          isAgent: node.isAgent,
          balance: node.balance,
          quota: node.quota,
          income: node.income,
          serviceRate: node.serviceRate,
          ratesOfAgent: node.ratesOfAgent,
          memberRates: node.memberRates,
          parentId: parentId,
          parentName: parentName,
          isOwnNode: node.email === userData?.email,
          for: forUser,
          triggerReload,
          isDescendant: node.ancestors?.includes(userData?.id),
          isEditMode: isEditMode,
          selectedNodes,
          handleSelectedNodes,
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

      node.children.forEach((child) => createNode(child, nodeId, node.name));
    };

    createNode(data);

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );

    setLayoutedNodes(layoutedNodes);
    setLayoutedEdges(layoutedEdges);
  };

  const exitEditMode = () => {
    setSelectedNodes([]);
    setIsEditMode(false);
  };

  useEffect(() => {
    if (opened) fetchReferralTreeData();
  }, [opened, reload, isEditMode, selectedNodes]);

  if (forUser === "admin")
    return (
      <Drawer
        opened={opened}
        onClose={() => {
          exitEditMode();
          close();
        }}
        size={"100%"}
        withCloseButton={true}
        title={
          <Flex align={"center"} justify={"space-between"}>
            <Text>
              {type === "members"
                ? `Team - ${treeData?.name} | Team Id : ${treeData?.id}`
                : `Organisation - ${treeData?.name} | Organisation Id : ${treeData?.id}`}
            </Text>
            {forUser === "admin" && type === "members" && (
              <Flex gap={"md"}>
                {!isEditMode ? (
                  <Button
                    onClick={() => {
                      setIsEditMode(true);
                    }}
                  >
                    Enter Edit Mode
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        handlerEditModal.open();
                      }}
                      disabled={!selectedNodes.some((node) => node.isLeafNode)}
                    >
                      Edit Referral Rates
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedNodes([]);
                      }}
                    >
                      Reset Selection
                    </Button>
                    <Button
                      color={"red"}
                      onClick={() => {
                        setSelectedNodes([]);
                        setIsEditMode(false);
                      }}
                    >
                      Exit Edit Mode
                    </Button>
                  </>
                )}
              </Flex>
            )}
          </Flex>
        }
      >
        <ReactFlow
          nodeTypes={{ memberNode: MemberNode, agentNode: AgentNode }}
          nodes={layoutedNodes}
          edges={layoutedEdges}
          fitView
          connectionLineType={ConnectionLineType.Step}
          nodesConnectable={false}
          nodesDraggable={false}
        >
          <Background variant={BackgroundVariant.Lines} bgColor="#ebe8e8" />
        </ReactFlow>

        <EditRateModalTeam
          isOpen={openedEditModal}
          onClose={handlerEditModal.close}
          data={selectedNodes}
          triggerReload={triggerReload}
          exitEditMode={exitEditMode}
        />
      </Drawer>
    );
  else
    return (
      <ReactFlow
        nodeTypes={{ memberNode: MemberNode, agentNode: AgentNode }}
        nodes={layoutedNodes}
        edges={layoutedEdges}
        fitView
        connectionLineType={ConnectionLineType.Step}
        nodesConnectable={false}
        nodesDraggable={false}
      >
        <Background variant={BackgroundVariant.Lines} bgColor="#f1f5f9" />
      </ReactFlow>
    );
};

export default Tree;
