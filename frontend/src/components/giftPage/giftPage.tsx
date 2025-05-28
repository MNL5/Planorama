import React, { useState, useTransition } from "react";
import { useParams } from "react-router-dom";
import {
  Title,
  Text,
  Stack,
  Container,
  TextInput,
  Flex,
  Button,
  Textarea,
  NumberInput,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import Cards, { Focused } from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import { toast } from "react-toastify";

import useEventByGuest from "../../hooks/use-event-by-guest";
import { CreateGift, Gift } from "../../types/gift";
import { createGift } from "../../services/gift-service/gift-service";
import MainLoader from "../mainLoader/MainLoader";
import { FormErrors, numberRegex, validateGift } from "../../utils/gift-utils";

const GiftPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { event, isLoading } = useEventByGuest(id);
  const [amount, setAmount] = useState<number | string>("");
  const [greeting, setGreeting] = useState<string>("");
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: createGiftFunction } = useMutation<
    Gift,
    Error,
    CreateGift
  >({
    mutationFn: (gift) => {
      return createGift(gift.eventId as string, gift);
    },
    onError: () => {
      toast.error("Failed to send your gift");
    },
  });

  const handleSubmit = async () => {
    const errors = validateGift(amount, greeting, card);
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
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
      setAmount("");
      setGreeting("");
      setCard({
        number: "",
        expiry: "",
        cvc: "",
        name: "",
        focus: "",
      });
      toast.success("Gift was received successfully!");
    });
  };

  const handleInputChange = (evt) => {
    setCard((prev) => {
      const { name, value } = evt.target;

      if (name === "number" && value.length > 19) return prev;
      if (name === "expiry" && value.length > 5) return prev;
      if (name === "cvc" && value.length > 4) return prev;

      const temp = { ...prev, [name]: value };

      if (
        name === "expiry" &&
        value.length === 2 &&
        numberRegex.test(value[0]) &&
        numberRegex.test(value[1]) &&
        prev.expiry.length === 1
      ) {
        temp[name] = `${value}/`;
      }

      return temp;
    });
  };

  const handleInputFocus = (evt) => {
    setCard((prev) => ({ ...prev, focus: evt.target.name }));
  };

  if (!event) {
    if (isLoading) {
      return <MainLoader isPending />;
    }
    return (
      <Stack
        align="center"
        justify="center"
        style={{ color: "#420F0F", padding: "20px" }}
      >
        <Title>Event not found</Title>
        <Text>Please check the link or contact the event organizer.</Text>
      </Stack>
    );
  }

  const time = new Date(event.time);
  const timeString = `${time.getHours()}:${time.getMinutes()}`;

  return (
    <Container
      size={"xl"}
      mt={"xl"}
      mb={"xl"}
      style={{ color: "#50147c", textAlign: "center" }}
      opacity={isPending ? 0.4 : 1}
    >
      <Stack>
        <MainLoader isPending={isPending} />
        <Title>Today It's Happening!</Title>
        <Title>{event.name}</Title>
        <Title>{timeString}</Title>
        <Flex gap={10}>
          <NumberInput
            placeholder="Gift Amount"
            onChange={setAmount}
            value={amount}
            min={1}
            error={errors?.amount}
          />
          <Text size="1.7rem">₪</Text>
        </Flex>
        <Textarea
          size={"sm"}
          placeholder="What do you wish for them?"
          key={"greeting"}
          name="greeting"
          onChange={(e) => setGreeting(e.target.value)}
          value={greeting}
          error={errors?.greeting}
        />
        <TextInput
          size={"sm"}
          placeholder="Card Number"
          key={"number"}
          type="number"
          name="number"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          value={card.number}
          error={errors.number}
        />
        <TextInput
          size={"sm"}
          placeholder="Name"
          key={"name"}
          type="text"
          name="name"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          value={card.name}
          error={errors.name}
        />
        <Flex gap={10} justify="space-between">
          <TextInput
            size={"sm"}
            placeholder="Valid Thru"
            key={"expiry"}
            type="text"
            name="expiry"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            value={card.expiry}
            error={errors.expiry}
          />
          <TextInput
            size={"sm"}
            placeholder="CVC"
            key={"cvc"}
            type="number"
            name="cvc"
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
          size={"md"}
          radius={"md"}
          variant={"light"}
          onClick={handleSubmit}
          m={"auto"}
        >
          <Text size={"xl"}>Send Gift</Text>
        </Button>
        <Text>Thank you for your gift!</Text>
      </Stack>
    </Container>
  );
};

export default GiftPage;
