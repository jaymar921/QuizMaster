import { QuizRoom } from "@/lib/definitions/quizRoom";
import { Checkbox, LoadingOverlay, Popover, Table, Text } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import { notification } from "@/lib/notifications";
import { useQuizRoomsStore } from "@/store/QuizRoomStore";
import PromptModal from "../modals/PromptModal";
import {
    QUIZMASTER_QUIZROOM_DELETE_BY_ID,
    QUIZMASTER_QUIZROOM_GET,
    QUIZMASTER_QUIZROOM_GET_BY_ID,
    QUIZMASTER_SET_GET_SETQUESTION,
} from "@/api/api-routes";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function QuizRoomTable() {
    const {
        quizRooms,
        getPaginatedRooms,
        pageNumber,
        pageSize,
        searchQuery,
        setQuizRooms,
    } = useQuizRoomsStore();
    const [paginatedRooms, setPaginatedRooms] = useState<QuizRoom[]>([]);
    const [deleteQuizRoom, setDeleteQuizRoom] = useState<QuizRoom>();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [viewQuizRoom, setViewQuizRoom] = useState<QuizRoom | undefined>();

    const handelDelete = useCallback(async () => {
        if (deleteQuizRoom) {
            try {
                // const res = await removeQuizRoom({ id: deleteQuizRoom.id });
                // if (res.type === "success") {
                //     notification({ type: "success", title: res.message });
                // } else {
                //     notification({ type: "error", title: res.message });
                // }
                setDeleteQuizRoom(undefined);
            } catch (error) {
                notification({ type: "error", title: "Something went wrong" });
            }
        }
    }, [deleteQuizRoom]);

    const apiCallSetCount = async (id: Number) => {
        const response = await fetch(QUIZMASTER_QUIZROOM_GET_BY_ID(id), {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });
        const { data } = await response.json();
        let sets: Array<number> = [];
        if (data.set) {
            for (let s of data.set) {
                sets.push(s.qSetId);
            }
        }
        return data.set ? [data.set.length, sets] : ["- no data -", sets];
    };
    const handleSetCount = async (id: Number) => {
        const setCount = localStorage.getItem("_sC");
        let _setCountTotal = null;
        if (!setCount) {
            const result = await apiCallSetCount(id);
            let arr: any[] = [];
            arr.push({
                id,
                setCount: result[0],
                questionCount: 0,
                sets: result[1],
            });
            localStorage.setItem("_sC", JSON.stringify(arr));
            _setCountTotal = result;
        } else {
            let arr: Array<any> = JSON.parse(setCount);
            let data = null;
            for (let ar of arr) {
                if (ar.id === id) {
                    data = ar;
                    _setCountTotal = ar.setCount;
                    break;
                }
            }

            if (!data) {
                const result = await apiCallSetCount(id);
                arr.push({
                    id,
                    setCount: result[0],
                    questionCount: 0,
                    sets: result[1],
                });
                localStorage.setItem("_sC", JSON.stringify(arr));
                _setCountTotal = result;
            }
        }

        return _setCountTotal ? _setCountTotal : "- no data -";
    };

    const apiCallQuestionCount = async (set: Array<number>) => {
        let totalNum = 0;
        for (let setId of set) {
            const response = await fetch(
                `${QUIZMASTER_SET_GET_SETQUESTION}${setId}`,
                {
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                }
            );
            const dJson = await response.json();
            console.log("Set " + setId + " has " + dJson.length + " questions");
            if (dJson) {
                totalNum += dJson.length;
            }
        }
        return totalNum;
    };

    const handleQuestionCount = async (id: Number) => {
        let totalNum: number = 0;
        const questionCount = localStorage.getItem("_sC"); // I know that this is not null since 'handleSetCount' already populated this
        if (questionCount) {
            let data = JSON.parse(questionCount);
            let foundDataForId = null;
            for (let d of data) {
                if (d.id === id) {
                    foundDataForId = d;
                    break;
                }
            }

            if (foundDataForId) {
                totalNum = foundDataForId.questionCount;

                if (totalNum === 0) {
                    // populate
                    totalNum = await apiCallQuestionCount(foundDataForId.sets);
                    console.log("api call");
                    let newList: Array<any> = [];
                    for (let d of data) {
                        if (d.id === id) {
                            d.questionCount = totalNum;
                        }
                        newList.push(d);
                    }
                    localStorage.setItem("_sC", JSON.stringify(newList));
                }
            }
        }
        return totalNum > 0 ? totalNum : "- no data -";
    };

    const getQuestionCount = (id: Number) => {
        let totalNum = 0;
        const questionCount = localStorage.getItem("_sC");
        if (questionCount) {
            let data = JSON.parse(questionCount);
            let foundDataForId = null;
            for (let d of data) {
                if (d.id === id) {
                    foundDataForId = d;
                    break;
                }
            }

            if (foundDataForId) {
                totalNum = foundDataForId.questionCount;
            }
        }
        return totalNum > 0 ? totalNum : "- no data -";
    };

    const getSetCount = (id: number) => {
        const setCount = localStorage.getItem("_sC");
        let _setCountTotal = null;

        if (setCount) {
            let arr: Array<any> = JSON.parse(setCount);
            let data = null;
            for (let ar of arr) {
                if (ar.id === id) {
                    data = ar;
                    _setCountTotal = ar.setCount;
                    break;
                }
            }
        }

        return _setCountTotal ? _setCountTotal : "- no data -";
    };

    const handleRemoveRoom = async (id: Number) => {
        const filter = (element: QuizRoom) => {
            return element.id != id;
        };
        setQuizRooms(paginatedRooms.filter(filter));
        console.log("done");
        const res = await fetch(QUIZMASTER_QUIZROOM_DELETE_BY_ID(id), {
            method: "DELETE",
            credentials: "include",
        });
        if (res.status === 200) {
            notification({
                type: "success",
                title: "Successfully removed room",
            });
        } else {
            notification({ type: "error", title: "Failed to removed room" });
        }
    };

    useEffect(() => {
        setPaginatedRooms(
            getPaginatedRooms({ pageNumber, pageSize, searchQuery })
        );
        (async () => {
            if (quizRooms) {
                for (let qR of quizRooms) {
                    await handleSetCount(qR.id);
                    await handleQuestionCount(qR.id);
                }
            }
        })();
    }, [quizRooms, pageNumber, pageSize, searchQuery]);

    const rows =
        quizRooms &&
        paginatedRooms.map((quizRoom) => (
            <Table.Tr
                key={quizRoom.id}
                bg={
                    selectedRows.includes(quizRoom.id)
                        ? "var(--primary-100)"
                        : undefined
                }
            >
                <Table.Td>
                    <Checkbox
                        color="green"
                        aria-label="Select row"
                        checked={selectedRows.includes(quizRoom.id)}
                        onChange={(event) =>
                            setSelectedRows(
                                event.currentTarget.checked
                                    ? [...selectedRows, quizRoom.id]
                                    : selectedRows.filter(
                                          (id) => id !== quizRoom.id
                                      )
                            )
                        }
                    />
                </Table.Td>
                <Table.Td
                    className="cursor-pointer"
                    onClick={() => setViewQuizRoom(quizRoom)}
                >
                    {quizRoom.qRoomDesc}
                </Table.Td>
                <Table.Td>{quizRoom.qRoomPin}</Table.Td>
                <Table.Td>{quizRoom.dateCreated.toDateString()}</Table.Td>
                <Table.Td>
                    {quizRoom.dateUpdated?.toDateString() ||
                        new Date().toDateString()}
                </Table.Td>
                <Table.Td>{getSetCount(quizRoom.id)}</Table.Td>

                <Table.Td>{getQuestionCount(quizRoom.id)}</Table.Td>
                <Table.Td>
                    <Popover width={140} zIndex={10} position="bottom">
                        <Popover.Target>
                            <div className="cursor-pointer flex items-center justify-center aspect-square">
                                <EllipsisVerticalIcon className="w-6" />
                            </div>
                        </Popover.Target>
                        <Popover.Dropdown p={10} className="space-y-3">
                            <button className="flex w-full p-2 gap-2 text-[var(--error)] rounded-lg hover:text-white hover:bg-[var(--error)]">
                                <TrashIcon className="w-6" />
                                <div
                                    onClick={() => {
                                        handleRemoveRoom(quizRoom.id);
                                    }}
                                >
                                    Remove
                                </div>
                            </button>
                        </Popover.Dropdown>
                    </Popover>
                </Table.Td>
            </Table.Tr>
        ));

    return (
        <div className="w-full border-2 rounded-xl overflow-x-auto grow bg-white">
            <Table striped>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>
                            <Checkbox
                                color="green"
                                aria-label="Select row"
                                checked={
                                    quizRooms &&
                                    selectedRows.length ===
                                        paginatedRooms.length
                                }
                                onChange={(event) =>
                                    setSelectedRows(
                                        event.currentTarget.checked && quizRooms
                                            ? paginatedRooms.map(
                                                  (quizRoom) => quizRoom.id
                                              )
                                            : []
                                    )
                                }
                            />
                        </Table.Th>
                        <Table.Th>Room Name</Table.Th>
                        <Table.Th>Pin</Table.Th>
                        <Table.Th>Created on</Table.Th>
                        <Table.Th>Updated on</Table.Th>
                        <Table.Th>Sets</Table.Th>
                        <Table.Th>Questions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {quizRooms === undefined ? (
                        <Table.Tr>
                            <Table.Td colSpan={99} rowSpan={10}>
                                <div className="relative h-60">
                                    <LoadingOverlay visible={true} />
                                </div>
                            </Table.Td>
                        </Table.Tr>
                    ) : quizRooms.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={99} rowSpan={10}>
                                <div className="flex grow justify-center">
                                    No Quiz Rooms found.
                                </div>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        rows
                    )}
                </Table.Tbody>
            </Table>
            <PromptModal
                body={
                    <div>
                        <Text>Are you sure want to delete.</Text>
                        {deleteQuizRoom?.qRoomDesc}
                    </div>
                }
                action="Delete"
                onConfirm={handelDelete}
                opened={deleteQuizRoom ? true : false}
                onClose={() => {
                    setDeleteQuizRoom(undefined);
                }}
                title="Delete QuizRoom"
            />
        </div>
    );
}
