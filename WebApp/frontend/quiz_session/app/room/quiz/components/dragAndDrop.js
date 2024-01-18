"use client";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { cardsData } from "../util/Data";
import { Button } from "@mantine/core";
import drag from "@/public/icons/drag.png";
import Image from "next/image";
import { submitAnswer } from "@/app/util/api";

export default function DragAndDrop({ question, connectionId }) {
  const [data, setData] = useState([]);
  const [answer, setAnswer] = useState([]);
  const [droppableId, setDroppableId] = useState("droppable");
  const [answerDetail, setAnswerDetail] = useState();

  const maxNewDataItems = 4;
  useEffect(() => {
    const options = question?.details;

    // Copy all elements except the last one
    const copiedData = [...options?.slice(0, options?.length - 1)];
    //Get the number of possible answers
    const lastElement = options[options.length - 1];
    const detail = JSON.parse(lastElement.qDetailDesc);
    setAnswerDetail(detail.length);

    setData(copiedData);
    setDroppableId("droppableId");
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    console.log(answer.length);
    if (result.source.droppableId === result.destination.droppableId) {
      // Dragged within the same droppable

      if (result.source.droppableId === `${droppableId} answer`) {
        const updatedData = [...answer];
        const [movedItem] = updatedData.splice(sourceIndex, 1);
        updatedData.splice(destinationIndex, 0, movedItem);
        setAnswer(() => updatedData);
      } else {
        const updatedData = [...data];
        const [movedItem] = updatedData.splice(sourceIndex, 1);
        updatedData.splice(destinationIndex, 0, movedItem);
        setData(updatedData);
      }
    } else {
      // Dragged to a different droppable
      if (result.source.droppableId === `${droppableId} answer`) {
        const updatedData = [...answer];
        const [movedItem] = updatedData.splice(sourceIndex, 1);
        setAnswer(updatedData);

        const updatedNewData = [...data];
        updatedNewData.splice(destinationIndex, 0, movedItem);
        setData(updatedNewData);
      } else {
        if (answer.length + 1 > maxNewDataItems) {
          console.log("lapas");
          return;
        }
        const updatedData = [...data];
        const [movedItem] = updatedData.splice(sourceIndex, 1);
        setData(updatedData);

        const updatedNewData = [...answer];
        updatedNewData.splice(destinationIndex, 0, movedItem);
        setAnswer(() => updatedNewData);
      }
    }

    // if (source.droppableId === destination.droppableId) {
    //   const newData = [...data];
    //   const el = newData.splice(source.index, 1);
    //   newData.splice(destination.index, 0, ...el);
    //   setData(newData);
    // } else {
    //   const newData = [...data];
    //   const oldIndex = parseInt(source.droppableId.split("droppable")[1]);
    //   const newIndex = parseInt(destination.droppableId.split("droppable")[1]);
    //   const el = newData[oldIndex].components.splice(source.index, 1);
    //   newData[newIndex].components.splice(destination.index, 0, ...el);
    //   setData(newData);
    // }
  };

  const handleSubmit = () => {
    console.log("On Submit");
    console.log(answer);
    const arrayOfIds = answer?.map((opt) => opt.id);
    console.log(arrayOfIds);
    const idsString = JSON.stringify(arrayOfIds);

    console.log(idsString);
    let id = question.question.id;
    submitAnswer({ id, answer: idsString, connectionId });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="w-full h-full  items-center flex flex-col p-4">
        <div className="flex flex-col w-full h-full">
          <div className="flex-grow items-center justify-center flex flex-col">
            <div className="text-white">Puzzle</div>
            <div className="font-bold text-xl text-white">
              {question?.question.qStatement}
            </div>
            <div className="w-full flex justify-center">
              <Droppable droppableId={`${droppableId} answer`}>
                {(provided) => (
                  <div
                    className="flex w-1/2 flex-col items-center "
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <div className=" w-full  items-center flex flex-col  ">
                      {answer?.map((option, index) => (
                        <Draggable
                          key={option.id}
                          draggableId={`droppable${option.id}`}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              className="bg-white flex w-full    items-center text-xl font-bold p-1 m-2 text-green_text shadow-lg rounded-lg px-2"
                              {...provided.dragHandleProps}
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                            >
                              <div>
                                <Image src={drag} className="" />
                              </div>
                              <div className="flex-grow  justify-center  flex">
                                {option?.qDetailDesc}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {Array.from({
                      length: Math.max(0, answerDetail - answer.length),
                    }).map((_, index) => (
                      <div
                        key={`placeholder-${index}`}
                        className="bg-dark_green flex w-full  justify-center m-2 h-10 rounded-lg"
                      ></div>
                    ))}
                  </div>
                )}
              </Droppable>
            </div>
          </div>

          <div className="w-full flex items-center flex-col h-1/4 flex-wrap p-2  ">
            <Droppable
              droppableId={`${droppableId} option`}
              direction="vertical"
            >
              {(provided) => (
                <div
                  className="flex w-full flex-row items-center  "
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <div className="w-full grid grid-cols-2 place-content-center  ">
                    {data?.map((option, index) => (
                      <Draggable
                        key={option?.id}
                        draggableId={`droppable${option?.id}`}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="bg-white flex    items-center text-xl font-bold p-1 m-2 text-green_text shadow-lg rounded-lg px-2"
                            {...provided.dragHandleProps}
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                          >
                            <div>
                              <Image src={drag} className="" />
                            </div>
                            <div className="flex-grow  justify-center  flex">
                              {option?.qDetailDesc}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                </div>
              )}
            </Droppable>
          </div>
          <div className=" w-full justify-center flex">
            <div className=" w-1/2 flex justify-center text-white text-2xl font-bold rounded-lg">
              <Button fullWidth color={"yellow"} onClick={handleSubmit}>
                Sumbit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
