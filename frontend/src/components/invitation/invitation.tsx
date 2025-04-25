import React, {useState} from 'react';
import { Stack, Title, Button, Text, Flex, Image } from '@mantine/core';
import classnames from 'classnames';

import style from './invitation.module.css';
import rsvp from "../../assets/rsvp.svg";
import { EventType } from '../../types/event';
import mealOptions from '../../utils/meal-options';
import { toast } from 'react-toastify';

const Invitation: React.FC<{event: EventType}> = ({event}) => {
    const [isFormMode, setIsFormMode] = useState(false);
    const [chosenMeals, setChosenMeals] = useState<Set<string>>(new Set());

    const handleMealOptionClick = (meal: string) => {
        setChosenMeals((prevMeals) => {
            const updatedMeals = new Set(prevMeals);
            if (!updatedMeals.delete(meal)) {
                updatedMeals.add(meal);
            }
            return updatedMeals;
        })
    }

    const handleSubmit = (status: string) => {
        toast.info(`RSVP Data: ${status}, ${JSON.stringify([...chosenMeals])}`);
    }

    return (
        <div className={style.container}>
            <h1 className={style.title}>Save The Date</h1>
            <span className={style.date}>{new Date(event.time).toLocaleString()}</span>
            <img
                className={style.img}
                src={event.invitationImg}
                alt="Event"
            />
            <h2 className={style.name}>{event?.name}</h2>
            {
                isFormMode ? (
                    <>
                        <Stack>
                            <Title size={"h2"} style={{textDecoration: "underline"}}>RSVP</Title>
                            <Stack align='start' gap={2}>
                                <Title size={"h3"}>Meal Options:</Title>
                                {mealOptions.map((option) => (
                                    <Flex
                                        key={option.value}
                                        className={style.option}
                                        onClick={handleMealOptionClick.bind(null, option.value)}
                                    >
                                        <Flex mr={"5px"} p={"5px"} h={"fit-content"} justify={"center"} className={classnames({[style.selected]: chosenMeals.has(option.value)})}>
                                            <Image src={option.image} w={"15px"} h={"15px"} />
                                        </Flex>
                                        <span>{option.name}</span>
                                    </Flex>
                                ))}
                            </Stack>
                        </Stack>
                        <Flex gap={20} justify={"space-between"} mt={20}>
                        <Button
                                p={0}
                                size={"md"}
                                radius={"md"}
                                w={"fit-content"}
                                variant={"transparent"}
                                onClick={handleSubmit.bind(null, "ACCEPTED")}
                            >
                                <Text size={"md"}>Accept</Text>
                            </Button>
                            <Button
                                p={0}
                                size={"md"}
                                radius={"md"}
                                w={"fit-content"}
                                variant={"transparent"}
                                onClick={handleSubmit.bind(null, "TENTATIVE")}
                            >
                                <Text size={"md"}>Not Sure</Text>
                            </Button>
                            <Button
                                p={0}
                                size={"md"}
                                radius={"md"}
                                w={"fit-content"}
                                variant={"transparent"}
                                onClick={handleSubmit.bind(null, "DECLINE")}
                            >
                                <Text size={"md"}>Decline</Text>
                            </Button>
                        </Flex>
                    </>
                ) : (
                    <>
                        <p className={style.text}>
                            {event.invitationText}
                        </p>
                        <div className={style.rsvpContainer} onClick={() => setIsFormMode(true)}>
                            <img
                                src={rsvp}
                                alt="RSVP"
                                style={{ width: '150px', height: '50px'}}
                            />
                            <div>
                                Approve RSVP
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default Invitation;