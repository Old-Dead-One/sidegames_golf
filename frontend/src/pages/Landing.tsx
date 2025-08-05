import React from 'react';
import Card from '../components/defaultcard';
import find_a_game_logo_black from '../assets/find_a_game_logo_black.svg';
import find_a_game_logo_blue from '../assets/find_a_game_logo_blue.svg';
import create_a_game_logo_black from '../assets/create_a_game_logo_black.svg';
import create_a_game_logo_blue from '../assets/create_a_game_logo_blue.svg';

interface LandingProps {
    theme: string;
}

const LandingPage: React.FC<LandingProps> = ({ theme }) => {

    return (
        <Card
            title="Welcome to sidegames.golf"
            theme={theme}
            includeInnerCard={true}
        >
            <div className="bg-white rounded-md flex flex-col items-center justify-around">
                <p className="p-4">Choose an option below to continue...</p>
                <div className="flex justify-center">
                    <div className="mb-2 px-2 flex flex-row justify-around w-full gap-4">
                        <a href="/dashboard">
                            <img
                                src={find_a_game_logo_black}
                                className="w-40 animate-pulse"
                                onMouseEnter={(e) => (e.currentTarget.src = find_a_game_logo_blue)}
                                onMouseLeave={(e) => (e.currentTarget.src = find_a_game_logo_black)}
                                alt="Find a Game"
                            />
                        </a>
                        <a href="/create-game">
                            <img
                                src={create_a_game_logo_black}
                                className="w-40 animate-pulse"
                                onMouseEnter={(e) => (e.currentTarget.src = create_a_game_logo_blue)}
                                onMouseLeave={(e) => (e.currentTarget.src = create_a_game_logo_black)}
                                alt="Create a Game"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default LandingPage;
