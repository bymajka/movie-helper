"use client";
import { useParams } from "next/navigation";

const TvPage = () => {
    const { id } = useParams();
    console.log(id);
    return (
        <div>  
            <h1>TV Page</h1>
        </div>
    )
}

export default TvPage;