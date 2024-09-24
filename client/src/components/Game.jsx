import React from "react";
import { useMyContext } from "../context/context";

const Game = () => {
  const { members, setMembers } = useMyContext();
  console.log("members",members);
  return (
    <div className="h-screen flex items-center justify-center w-full">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Game Members
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {members.length > 0 ? (
            members.map((member, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              >
                <div className="text-xl font-semibold text-gray-700 text-center">
                  {member}
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-600 text-center">
              No members available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
