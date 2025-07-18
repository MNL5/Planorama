import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Drawer,
  Flex,
  NumberInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";

import Element from "../../types/Element";
import RndElement from "../RndElement/RndElement";
import { useEventContext } from "../../contexts/event-context";
import { updateEvent } from "../../services/event-service/event-service";
import MainLoader from "../mainLoader/MainLoader";
import gridCanvas from "../../assets/grid-canvas.png";
import { useFetchAllGuests } from "../../hooks/use-fetch-all-guests";

const ELEMENT_TYPES = [
  { type: "square", label: "Square Table", elementType: "table" },
  { type: "rectangle", label: "Rectangle Table", elementType: "table" },
  { type: "circle", label: "Circular Table", elementType: "table" },
  { type: "rectangle", label: "Rectangle Text", elementType: "text" },
  { type: "circle", label: "Circular Text", elementType: "text" },
] as const;

const INITIAL_SEAT_COUNT = 1;

const TableArrangement = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [seatCount, setSeatCount] = useState<number>(INITIAL_SEAT_COUNT);
  const [textLabel, setTextLabel] = useState("");
  const [selectedType, setSelectedType] = useState<{
    type: Element["type"];
    elementType: Element["elementType"];
    id?: string;
  } | null>(null);
  const { currentEvent, setCurrentEvent } = useEventContext();
  const [isPending, startTransition] = useTransition();

  const { guestsData: guests } = useFetchAllGuests(true);

  const handleAddElement = () => {
    if (!canvasRef.current || !selectedType) return;

    if (selectedType.id) {
      const updatedElement = elements.find((el) => el.id === selectedType.id);
      if (updatedElement) {
        setElements((prev) =>
          prev.map((el) =>
            el.id === selectedType.id
              ? {
                  ...el,
                  label:
                    selectedType.elementType === "table"
                      ? `(${seatCount})`
                      : textLabel,
                  seatCount:
                    selectedType.elementType === "table"
                      ? seatCount
                      : undefined,
                }
              : el,
          ),
        );
      }
    } else {
      const { width, height } = canvasRef.current.getBoundingClientRect();
      const centerX = width / 2 - 50;
      const centerY = height / 2 - 50;

      const newElement: Element = {
        id: uuidv4(),
        type: selectedType.type,
        label:
          selectedType.elementType === "table" ? `(${seatCount})` : textLabel,
        width: selectedType.type === "rectangle" ? 160 : 100,
        height: 100,
        x: centerX,
        y: centerY,
        color: selectedType.elementType === "table" ? "#d0b9e0" : "#e9dbf1",
        elementType: selectedType.elementType,
        ...(selectedType.elementType === "table" ? { seatCount } : {}),
      };

      setElements((prev) => [...prev, newElement]);
    }

    resetDrawer();
  };

  const resetDrawer = () => {
    setSeatCount(INITIAL_SEAT_COUNT);
    setTextLabel("");
    setSelectedType(null);
  };

  const handleUpdate = (updated: Element) => {
    setElements((prev) =>
      prev.map((el) => (el.id === updated.id ? updated : el)),
    );
  };

  const handleDelete = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        if (currentEvent?.id) {
          const updatedEvent = await updateEvent(
            { ...currentEvent, diagram: { elements } },
            currentEvent.id,
          );
          setCurrentEvent(updatedEvent);
          toast.success("Seating arrangement saved");
        } else {
          console.error("No current event ID");
        }
      } catch (error: any) {
        console.error("Save failed:", error);
        toast.error(error?.response?.data?.error || "An error occurred");
      }
    });
  };

  const loadLayout = () => {
    const loadedElements = currentEvent?.diagram?.elements;
    setElements(loadedElements || []);
  };

  useEffect(() => {
    loadLayout();
  }, []);

  const guestsCount = useMemo(
    () =>
      guests?.filter((guest) => guest.tableId === selectedType?.id).length ||
      INITIAL_SEAT_COUNT,
    [guests, selectedType],
  );

  return (
    <Flex style={{ direction: "rtl", flex: "1 1" }}>
      <MainLoader isPending={isPending} />

      <Box
        flex={1}
        style={{ backgroundImage: `url(${gridCanvas})` }}
        ref={canvasRef}
        pos="relative"
        bg="#fff"
        bd={"1px solid rgb(230, 229, 229)"}
      >
        {elements
          .filter((ele) => ele.elementType === "table")
          .map((el, i) => (
            <RndElement
              key={el.id}
              element={el}
              tableNumber={i + 1}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onEdit={() => {
                setSelectedType({
                  elementType: "table",
                  type: el.type,
                  id: el.id,
                });
                setSeatCount(el.seatCount || INITIAL_SEAT_COUNT);
              }}
            />
          ))}
        {elements
          .filter((ele) => ele.elementType === "text")
          .map((el) => (
            <RndElement
              key={el.id}
              element={el}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onEdit={() => {
                setSelectedType({
                  elementType: "text",
                  type: el.type,
                  id: el.id,
                });
                setTextLabel(el.label || "");
              }}
            />
          ))}
      </Box>

      <Stack
        w={200}
        color="white"
        p="lg"
        align="center"
        justify="space-between"
        bg="linear-gradient(to right, #e9dbf1, #e6c8fa)"
      >
        <div style={{ padding: 16, textAlign: "center" }}>
          <Title order={2} py={"lg"} c={"primary"}>
            Menu
          </Title>
          {ELEMENT_TYPES.map(({ type, elementType, label }, i) => (
            <Button
              key={i}
              fullWidth
              className="primary-btn"
              style={{ fontSize: 12, fontWeight: "lighter" }}
              onClick={() => {
                setSelectedType({ type, elementType });
              }}
            >
              {label}
            </Button>
          ))}
        </div>

        <Button variant="light" size="md" radius="md" onClick={handleSave}>
          Save
        </Button>
      </Stack>

      <Drawer
        opened={!!selectedType}
        onClose={resetDrawer}
        title={selectedType?.elementType === "table" ? "Add Table" : "Add Text"}
        position="left"
      >
        {selectedType?.elementType === "table" ? (
          <NumberInput
            label="Number of Seats"
            min={guestsCount || 1}
            value={seatCount}
            onChange={(value) => setSeatCount(Number(value))}
          />
        ) : (
          <TextInput
            label="Text"
            value={textLabel}
            onChange={({ target }) => setTextLabel(target.value || "")}
          />
        )}
        <Button
          mt="md"
          fullWidth
          radius="md"
          color="#6a0572"
          onClick={handleAddElement}
        >
          Add
        </Button>
      </Drawer>
    </Flex>
  );
};

export default TableArrangement;
