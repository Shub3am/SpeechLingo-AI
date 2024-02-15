export default function Home() {
    return (
        <div className="bg-white dark:bg-gray-900 h-auto">
            <center>Translated
            <video style={{width: "750px"}} controls ><source src="http://localhost:8000/output.mp4" type="video/mp4"/></video>
            </center>
        </div>
    )
}
