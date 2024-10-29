// components/FlowchartGenerator.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import FlowchartHeader from './FlowchartHeder';
import TopicInput from './TopicInput';
import FlowchartDisplay from './FlowchartDisplay';
import ExportButtons from './ExportButtons';
import { generateMindMapNodes, generateMindMapEdges } from '../utils/flowchartUtils';

const FlowchartGenerator = () => {
    const [topic, setTopic] = useState('');
    const [mindMapData, setMindMapData] = useState([]);
    const [edges, setEdges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const flowchartRef = useRef();

    const handleGenerateMindMap = async () => {
        setLoading(true);
        setError('');
        setMindMapData([]);
        setEdges([]);

        try {
            const response = await axios.post('http://localhost:4000/api/generate-flowchart', { topic });
            const flowchartData = response.data.flowchartData;

            const mindMapNodes = generateMindMapNodes(flowchartData);
            const mindMapEdges = generateMindMapEdges(mindMapNodes.length);

            setMindMapData(mindMapNodes);
            setEdges(mindMapEdges);
        } catch (err) {
            setError('Failed to generate mind map. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const exportToImage = async () => {
        if (flowchartRef.current) {
            const canvas = await html2canvas(flowchartRef.current);
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

        html2canvas(flowchartRef.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 10, 20, imgWidth, imgHeight);
            pdf.save('flowchart.pdf');
        });
    };

    return (
        <div className="min-h-screen bg-[#121212] text-gray-200">
            <div className="container mx-auto px-4 py-8">
                <FlowchartHeader />
                <TopicInput
                    topic={topic}
                    setTopic={setTopic}
                    handleGenerateMindMap={handleGenerateMindMap}
                    loading={loading}
                />

                {error && (
                    <div className="text- You can also use a code editor like Visual Studio Code to format your code. It has a built-in formatter that can help you keep your code organized and readable.red-400 text-center mb-4">
                        {error}
                    </div>
                )}

                {mindMapData.length > 0 && (
                    <div className="mt-8" ref={flowchartRef}>
                        <FlowchartDisplay mindMapData={mindMapData} edges={edges} flowchartRef={flowchartRef} />
                        <ExportButtons exportToImage={exportToImage} exportToPDF={exportToPDF} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlowchartGenerator;