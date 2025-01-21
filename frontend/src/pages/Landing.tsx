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
        <Card title="Welcome to sidegames.golf" theme={theme}>
            <div className="w-full py-2 text-left flex justify-center mx-auto">
                <div className="p-2 bg-neutral-500 bg-opacity-95 rounded-lg">
                    <div className="text-sm text-center">
                        <p className="my-2 text-white">Choose an option below to continue...</p>
                        <div className="flex justify-center items-center py-2 mx-2">
                            <div>
                                <a href="/dashboard">
                                    <img
                                        src={find_a_game_logo_black}
                                        className="w-80 transition-colors duration-300"
                                        onMouseEnter={(e) => (e.currentTarget.src = find_a_game_logo_blue)}
                                        onMouseLeave={(e) => (e.currentTarget.src = find_a_game_logo_black)}
                                        alt="Find a Game"
                                    />
                                </a>
                            </div>
                            <div>
                                <a href="/CreateGame">
                                    <img
                                        src={create_a_game_logo_black}
                                        className="w-80 transition-colors duration-300"
                                        onMouseEnter={(e) => (e.currentTarget.src = create_a_game_logo_blue)}
                                        onMouseLeave={(e) => (e.currentTarget.src = create_a_game_logo_black)}
                                        alt="Create a Game"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default LandingPage;
