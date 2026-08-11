import {
  createConnection,
  makeNode,
  type MindMapConnection,
  type MindMapNode,
} from "@/lib/mindmap";

export type TemplateId = "study-planner" | "swot" | "brainstorm";

export type TemplateBlueprint = {
  id: TemplateId;
  name: string;
  mapTitle: string;
  description: string;
  build: () => { nodes: MindMapNode[]; connections: MindMapConnection[] };
};

function link(nodes: MindMapNode[], pairs: [number, number][]) {
  return pairs.map(([a, b]) => createConnection(nodes[a]!.id, nodes[b]!.id));
}

export const TEMPLATES: TemplateBlueprint[] = [
  {
    id: "study-planner",
    name: "Study Planner",
    mapTitle: "Study Planner",
    description: "Break a subject into topics, revision blocks and deadlines.",
    build() {
      const nodes = [
        makeNode("Study Plan", 420, 60, "violet", "circle"),
        makeNode("Subjects", 140, 260, "blue"),
        makeNode("Revision Blocks", 420, 300, "teal"),
        makeNode("Deadlines", 720, 260, "rose"),
        makeNode("Maths", 60, 420, "blue"),
        makeNode("Science", 240, 420, "blue"),
        makeNode("Weekly Review", 420, 460, "teal"),
        makeNode("Exam Dates", 720, 420, "amber"),
      ];
      return {
        nodes,
        connections: link(nodes, [
          [0, 1],
          [0, 2],
          [0, 3],
          [1, 4],
          [1, 5],
          [2, 6],
          [3, 7],
        ]),
      };
    },
  },
  {
    id: "swot",
    name: "SWOT Analysis",
    mapTitle: "SWOT Analysis",
    description: "Four quadrants for strengths, weaknesses, opportunities and threats.",
    build() {
      const nodes = [
        makeNode("SWOT", 420, 240, "slate", "circle"),
        makeNode("Strengths", 140, 100, "teal"),
        makeNode("Weaknesses", 720, 100, "rose"),
        makeNode("Opportunities", 140, 420, "blue"),
        makeNode("Threats", 720, 420, "amber"),
        makeNode("Internal advantages", 60, 620, "teal"),
        makeNode("External risks", 720, 620, "amber"),
      ];
      return {
        nodes,
        connections: link(nodes, [
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
          [1, 5],
          [4, 6],
        ]),
      };
    },
  },
  {
    id: "brainstorm",
    name: "Brainstorming Map",
    mapTitle: "Brainstorming Map",
    description: "A central idea with radiating branches for rapid idea capture.",
    build() {
      const nodes = [
        makeNode("Central Idea", 420, 260, "amber", "circle"),
        makeNode("Idea 1", 120, 100, "blue"),
        makeNode("Idea 2", 720, 100, "teal"),
        makeNode("Idea 3", 120, 440, "violet"),
        makeNode("Idea 4", 720, 440, "rose"),
        makeNode("Next steps", 420, 600, "slate"),
      ];
      return {
        nodes,
        connections: link(nodes, [
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
          [0, 5],
        ]),
      };
    },
  },
];
