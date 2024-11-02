// flowchartUtils.js
export const generateMindMapNodes = (flowchartData) => {
    return flowchartData.map((point, index) => ({
        id: `node-${index}`,
        data: { label: point.label },
        position: { x: Math.random() * 250, y: index * 100 }, // Randomized position
    })).filter(node => node.data.label); // Filter out empty labels
};

export const generateMindMapEdges = (nodeCount) => {
    const edges = [];
    for (let i = 0; i < nodeCount - 1; i++) {
        edges.push({
            id: `edge-${i}`,
            source: `node-${i}`,
            target: `node-${i + 1}`,
            animated: true,
        });
    }
    return edges;
};
