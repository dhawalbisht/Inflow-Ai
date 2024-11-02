import React from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';

const FlowchartDisplay = ({ mindMapData, edges }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(mindMapData);
    const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);

    const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

    return (
        <div className="h-[600px] rounded-lg overflow-hidden border border-gray-800">
            <ReactFlow
                nodes={nodes}
                edges={edgesState}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                style={{
                    background: '#1A1A1A',
                }}
            >
                <MiniMap
                    style={{
                        background: '#1E1E1E',
                        border: '1px solid #383838',
                    }}
                />
                <Controls />
                <Background color="#333" gap={16} />
            </ReactFlow>
        </div>
    );
};

export default FlowchartDisplay;
