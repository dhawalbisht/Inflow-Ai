// components/ExportButtons.jsx
const ExportButtons = ({ exportToImage, exportToPDF }) => (
    <div className="flex justify-center gap-4 mt-6">
        <button
            onClick={exportToImage}
            className="px-6 py-2 bg-[#2D2D2D] rounded-md hover:bg-[#353535] transition duration-300"
        >
            Export as Image
        </button>
        <button
            onClick={exportToPDF}
            className="px-6 py-2 bg-[#2D2D2D] rounded-md hover:bg-[#353535] transition duration-300"
        >
            Export as PDF
        </button>
    </div>
);

export default ExportButtons;