import React, { useState } from 'react';
import { Stack, Title, Button, Text, Flex, Image } from '@mantine/core';
import classnames from 'classnames';

import style from './invitation.module.css';
import rsvp from '../../assets/rsvp.svg';
import { Event } from '../../types/event';
import mealOptions from '../../utils/meal-options';
import { useMutation } from '@tanstack/react-query';
import { Guest } from '../../types/guest';
import { updateGuest } from '../../Services/guest-service/guest-service';
import { toast } from 'react-toastify';

const Invitation: React.FC<{ event: Event; guestId?: string }> = ({
    event,
    guestId,
}) => {
    const [isFormMode, setIsFormMode] = useState(false);
    const [chosenMeals, setChosenMeals] = useState<Set<string>>(new Set());

    const handleMealOptionClick = (meal: string) => {
        setChosenMeals((prevMeals) => {
            const updatedMeals = new Set(prevMeals);
            if (!updatedMeals.delete(meal)) {
                updatedMeals.add(meal);
            }
            return updatedMeals;
        });
    };

    const { mutateAsync: mutateUpdateGuest } = useMutation<
        Guest,
        Error,
        Guest
    >({
        mutationFn: (updatedGuest) =>
        updateGuest(event.id as string, updatedGuest, updatedGuest.id),
        onSuccess: () => {
        toast.success("Your RSVP has been updated successfully");
        },
        onError: () => {
        toast.error("Failed to update your RSVP");
        }
    });


    const handleSubmit = (status: string) => {
        mutateUpdateGuest({
            id: guestId as string,
            status,
            meal: Array.from(chosenMeals),
        } as Guest);
    };

    return (
        <div className={style.container}>
            <h1 className={style.title}>Save The Date</h1>
            <span className={style.date}>
                {new Date(event.time).toLocaleString()}
            </span>
            <img className={style.img} src={event.invitationImg} alt="Event" />
            <h2 className={style.name}>{event?.name}</h2>
            {isFormMode ? (
                <>
                    <Stack>
                        <Title
                            size={'h2'}
                            style={{ textDecoration: 'underline' }}
                        >
                            RSVP
                        </Title>
                        <Stack align="start" gap={2}>
                            <Title size={'h3'}>Meal Options:</Title>
                            {mealOptions.map((option) => (
                                <Flex
                                    key={option.value}
                                    className={style.option}
                                    onClick={handleMealOptionClick.bind(
                                        null,
                                        option.value
                                    )}
                                >
                                    <Flex
                                        mr={'5px'}
                                        p={'5px'}
                                        h={'fit-content'}
                                        justify={'center'}
                                        className={classnames({
                                            [style.selected]: chosenMeals.has(
                                                option.value
                                            ),
                                        })}
                                    >
                                        <Image
                                            src={option.image}
                                            w={'15px'}
                                            h={'15px'}
                                        />
                                    </Flex>
                                    <span>{option.label}</span>
                                </Flex>
                            ))}
                        </Stack>
                    </Stack>
                    <Flex gap={20} justify={'space-between'} mt={20}>
                        <Button
                            size={'md'}
                            radius={'md'}
                            w={'fit-content'}
                            variant={'light'}
                            onClick={handleSubmit.bind(null, 'ACCEPTED')}
                        >
                            <Text size={'md'}>Accept</Text>
                        </Button>
                        <Button
                            size={'md'}
                            radius={'md'}
                            w={'fit-content'}
                            variant={'light'}
                            onClick={handleSubmit.bind(null, 'TENTATIVE')}
                        >
                            <Text size={'md'}>Not Sure</Text>
                        </Button>
                        <Button
                            size={'md'}
                            radius={'md'}
                            w={'fit-content'}
                            variant={'light'}
                            onClick={handleSubmit.bind(null, 'DECLINE')}
                        >
                            <Text size={'md'}>Decline</Text>
                        </Button>
                    </Flex>
                </>
            ) : (
                <>
                    <p className={style.text}>{event.invitationText}</p>
                    <div
                        className={classnames(style.rsvpContainer, {
                            [style.disabled]: !guestId,
                        })}
                        onClick={() => guestId && setIsFormMode(true)}
                    >
                        <img
                            src={rsvp}
                            alt="RSVP"
                            style={{ width: '150px', height: '50px' }}
                        />
                        <div>Approve RSVP</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Invitation;
