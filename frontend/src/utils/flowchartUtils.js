// utils/flowchartUtils.js
export const customNodeStyle = {
    background: '#1E1E1E',
    color: '#E4E4E4',
    border: '1px solid #383838',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    fontFamily: 'Inter, sans-serif',
};

export const generateMindMapNodes = (flowchartData) => {
    const topics = flowchartData.split('\n').filter(Boolean);
    return topics.map((topic, index) => ({
        id: `node-${index}`,
        data: { label: topic },
        position: { x: Math.random() * 800, y: index * 100 },
        style: customNodeStyle,
    }));
};

export const generateMindMapEdges = (nodeCount) => {
    const edges = [];
    for (let i = 0; i < nodeCount - 1; i++) {
        edges.push({
            id: `edge-${i}`,
            source: `node-${i}`,
            target: `node-${i + 1}`,
            animated: true,
            style: { stroke: '#383838', strokeWidth: 2 },
        });
    }
    return edges;
};