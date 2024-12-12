import React from "react";
import Card from "../components/defaultcard";
// import { useUser } from "../context/UserContext";

const Messages: React.FC<{ theme: string }> = ({ theme }) => {

    return (
        <Card title="Messages" theme={theme}>
            <div className="p-4">
                <p className="text-green-700 font-bold text-2xl">Coming soon.</p>
            </div>
        </Card>
    );
};

export default Messages;