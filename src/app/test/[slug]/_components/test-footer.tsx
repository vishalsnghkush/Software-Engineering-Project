import { Button } from "@heroui/react";
import React from "react";

const TestFooter = () => {
  return (
    <div className="bg-green-200 flex flex-col md:flex-row gap-2 p-2 w-full">
      <div className="flex gap-2 bg-pink-200 w-full">
        <Button className="flex-1 md:flex-0 bg-red-400 text-white">
          Clear
        </Button>
        <Button className="flex-1 md:flex-initial md:w-28 bg-purple-400 text-white">
          Mark & Next
        </Button>
        <Button className="flex-1 md:flex-initial md:w-28 md:ml-auto bg-green-400 text-white">
          Save & Next
        </Button>
      </div>
      <div className="flex gap-2 bg-orange-200">
        <Button className="flex-2 bg-cyan-400 text-white">Submit Test</Button>
      </div>
    </div>
  );
};

export default TestFooter;
