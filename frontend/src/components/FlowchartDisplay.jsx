// src/components/FlowchartDisplay.jsx

import React from 'react';
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from 'react-flow-renderer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FlowchartDisplay = ({ mindMapData, edges }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState(mindMapData);
    const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges);

    const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

    const exportToImage = async () => {
        const flowchartElement = document.querySelector('.react-flow'); // Select the React Flow container
        if (flowchartElement) {
            const canvas = await html2canvas(flowchartElement);
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'flowchart.png';
            link.click();
        }
    };

    const exportToPDF = () => {
        const pdf = new jsPDF();
        pdf.text('Mind Map', 10, 10);

        const flowchartElement = document.querySelector('.react-flow'); // Select the React Flow container
        html2canvas(flowchartElement).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
            pdf.save('flowchart.pdf');
        });
    };

    return (
        <div className="relative h-screen p-4"> {/* Allow space for buttons */}
            {/* Export Buttons */}
            <div className="absolute top-4 right-4 z-10"> {/* Position buttons */}
                <button
                    onClick={exportToImage}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 text-sm rounded-md hover:opacity-90 transition duration-300 disabled:opacity-50 mr-2"
                >
                    Export as Image
                </button>
                <button
                    onClick={exportToPDF}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 text-sm rounded-md hover:opacity-90 transition duration-300 disabled:opacity-50"
                >
                    Export as PDF
                </button>
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edgesState}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                style={{
                    width: '100%',
                    height: 'calc(100% - 60px)', // Adjust height to leave space for buttons
                    background: '#1A1A1A',
                    borderRadius: '8px', // Optional: add rounded corners
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
