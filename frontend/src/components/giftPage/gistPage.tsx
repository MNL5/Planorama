import React, { useState, useTransition } from 'react';
import { CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import { Title, Text, Stack, Container, TextInput, Flex, Button, Textarea, NumberInput } from '@mantine/core';
import { useMutation } from '@tanstack/react-query';
import Cards, { Focused } from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

import useEventByGuest from '../../hooks/use-event-by-guest';
import { CreateGift, Gift } from '../../types/gift';
import { createGift } from '../../Services/gift-service/gift-service';
import { toast } from 'react-toastify';
import { createPortal } from 'react-dom';

type FormErrors = {
  number?: string;
  expiry?: string;
  cvc?: string;
  name?: string;
  amount?: string;
  greeting?: string;
}

const creditCardRegex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/
const numberRegex = /^\d+$/;

const GiftPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const {event, isLoading} = useEventByGuest(id);
    const [amount, setAmount] = useState<number | string>("");
    const [greeting, setGreeting] = useState<string>("");
    const [card, setCard] = useState({
      number: '',
      expiry: '',
      cvc: '',
      name: '',
      focus: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isPending, startTransition] = useTransition();

    const { mutateAsync: createGiftFunction } = useMutation<
        Gift,
        Error,
        CreateGift
    >({
        mutationFn: (gift) => {
          return createGift(gift.eventId as string, gift)
        },
        onError: () => {
          toast.error("Failed to send your gift");
        }
    });

    if (!event) {
        if (isLoading) {
            return (
                  <CircularProgress
                    color="secondary"
                    style={{ position: "absolute", top: "40%", left: "50%" }}
                  />
                );
        }
        return <Stack align='center' justify='center' style={{color: '#420F0F', padding: '20px'}}>
                <Title>Event not found</Title>
                <Text>Please check the link or contact the event organizer.</Text>
            </Stack> 
    }

    const handleSubmit = async () => {
      const errors = {} as FormErrors;
      if (!amount) errors.amount = "Please enter a gift amount";
      if (!greeting) errors.greeting = "Please enter a greeting message";
      if (!card.number) errors.number = "Please enter a card number";
      if (!card.name) errors.name = "Please enter a name on the card";
      if (!card.expiry) errors.expiry = "Please enter a valid expiry date";
      if (!card.cvc) errors.cvc = "Please enter a valid CVC code";
      if (!creditCardRegex.test(card.number)) errors.number = "Please enter a valid card number";
      if (card.expiry.length !== 5 || card.expiry[2] !== '/') errors.expiry = "Please enter a valid expiry date in MM/YY format";
      if (card.cvc.length !== 3 && card.cvc.length !== 4) errors.cvc = "Please enter a valid CVC code";
      setErrors(errors);
      if (errors.number || errors.expiry || errors.cvc || errors.name || errors.amount || errors.greeting) {
        return;
      }

      startTransition(async () => {
        await createGiftFunction({
          guestId: id as string,
          amount: Number(amount),
          greeting: greeting,
          eventId: event.id as string,
        } as CreateGift);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        toast.success("Gift was received successfully!");
      })
    };

    const handleInputChange = (evt) => {
      setCard((prev) => {
        const { name, value } = evt.target;

        if (name === 'number' && value.length > 19) return prev;
        if (name === 'expiry' && value.length > 5) return prev;
        if (name === 'cvc' && value.length > 4) return prev;

        const temp = {...prev, [name]: value}
  
        if (name === 'expiry' && 
            value.length === 2 && 
            numberRegex.test(value[0]) && 
            numberRegex.test(value[1]) && 
            prev.expiry.length === 1) {
          temp[name] = `${value}/`
        }

        return temp;
      })
    }
  
    const handleInputFocus = (evt) => {
      setCard((prev) => ({ ...prev, focus: evt.target.name }));
    }

    const time = new Date(event.time)
    const timeString = `${time.getHours()}:${time.getMinutes()}`

    return <Container size={"xl"} mt={"xl"} mb={"xl"} style={{color: '#420F0F', textAlign: 'center'}} opacity={isPending ? 0.4 : 1}>
        <Stack>
          {
            isPending && createPortal(
              <Flex pos={"absolute"} top={0} left={0} right={0} bottom={0} justify={"center"} align={"center"} style={{zIndex: 100}}>
                <CircularProgress color="secondary"/>
              </Flex>,
              document.getElementById("root")!
            )
          }
          <Title>Today It's Happening!</Title>
          <Title>{event.name}</Title>
          <Title>{timeString}</Title>
          <Flex gap={10}>
            <NumberInput
                placeholder="Gift Amount"
                onChange={setAmount}
                min={1}
                error={errors?.amount}
            />
            <Text size='1.7rem'>₪</Text>
          </Flex>
          <Textarea
              size={'sm'}
              placeholder="What do you wish for them?"
              key={"greeting"}
              name='greeting'
              onChange={(e) => setGreeting(e.target.value)}
              error={errors?.greeting}
          />
          <TextInput
              size={'sm'}
              placeholder="Card Number"
              key={"number"}
              type='number'
              name='number'
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              value={card.number}
              error={errors.number}
          />
          <TextInput
              size={'sm'}
              placeholder="Name"
              key={"name"}
              type='text'
              name='name'
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              value={card.name}
              error={errors.name}
          />
          <Flex gap={10} justify='space-between'>
            <TextInput
                size={'sm'}
                placeholder="Valid Thru"
                key={"expiry"}
                type='text'
                name='expiry'
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                value={card.expiry}
                error={errors.expiry}
            />
            <TextInput
                size={'sm'}
                placeholder="CVC"
                key={"cvc"}
                type='number'
                name='cvc'
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                value={card.cvc}
                error={errors.cvc}
            />
          </Flex>
          <Cards
            number={card.number}
            expiry={card.expiry}
            cvc={card.cvc}
            name={card.name}
            focused={card.focus as Focused}
          />
          <Button
              size={'md'}
              radius={'md'}
              variant={'light'}
              onClick={handleSubmit}
              m={'auto'}
          >
              <Text size={'xl'}>
              Send Gift
              </Text>
          </Button>
          <Text>Thank you for your gift!</Text>
      </Stack>
    </Container>
};

export default GiftPage;