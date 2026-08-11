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
        makeNode("Study Plan", 420, 20, "violet", "circle"),
        makeNode("Subjects", 140, 200, "blue"),
        makeNode("Revision Blocks", 420, 220, "teal"),
        makeNode("Deadlines", 720, 200, "rose"),
        makeNode("Maths", 60, 350, "blue"),
        makeNode("Science", 240, 350, "blue"),
        makeNode("Weekly Review", 420, 360, "teal"),
        makeNode("Exam Dates", 720, 350, "amber"),
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
        makeNode("SWOT", 420, 180, "slate", "circle"),
        makeNode("Strengths", 140, 40, "teal"),
        makeNode("Weaknesses", 720, 40, "rose"),
        makeNode("Opportunities", 140, 320, "blue"),
        makeNode("Threats", 720, 320, "amber"),
        makeNode("Internal advantages", 60, 470, "teal"),
        makeNode("External risks", 720, 470, "amber"),
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
        makeNode("Central Idea", 420, 200, "amber", "circle"),
        makeNode("Idea 1", 120, 40, "blue"),
        makeNode("Idea 2", 720, 40, "teal"),
        makeNode("Idea 3", 120, 330, "violet"),
        makeNode("Idea 4", 720, 330, "rose"),
        makeNode("Next steps", 420, 450, "slate"),
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
