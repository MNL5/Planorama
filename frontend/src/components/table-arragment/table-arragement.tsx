import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { Box, Button, Drawer, NumberInput, Text } from "@mantine/core";

import Element from "../../types/Element";
import RndElement from "../RndElement/RndElement";
import { useEventContext } from "../../contexts/event-context";
import { updateEvent } from "../../services/event-service/event-service";

const elementTypes = [
  { type: "square", label: "Square Table" },
  { type: "rectangle", label: "Rectangle Table" },
  { type: "circle", label: "Circular Table" },
] as const;

const TableArrangement = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<Element[]>([]);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [seatCount, setSeatCount] = useState<number | string>(1);
  const [selectedType, setSelectedType] = useState<Element["type"] | null>(
    null
  );
  const { currentEvent, setCurrentEvent } = useEventContext();

  const addElement = () => {
    if (!canvasRef.current || !selectedType) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    const newElement: Element = {
      id: uuidv4(),
      type: selectedType,
      label: `(${seatCount})`,
      width: selectedType === "rectangle" ? 160 : 100,
      height: 100,
      x: canvasRect.width / 2 - 50,
      y: canvasRect.height / 2 - 50,
      color: "#d0b9e0",
      ids: [],
      seatCount,
    };

    setElements((prev) => [...prev, newElement]);
    setDrawerOpened(false);
    setSeatCount(1);
    setSelectedType(null);
  };

  const updateElement = (updated: Element) => {
    setElements((prev) =>
      prev.map((el) => (el.id === updated.id ? updated : el))
    );
  };

  const deleteElement = (id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
  };

  const handleSave = async () => {
    try {
      if (currentEvent?.id) {
        setCurrentEvent(
          await updateEvent(
            { ...currentEvent, diagram: { elements } },
            currentEvent.id
          )
        );
        toast.success("Seating arrangement saved");
      } else {
        console.error("no current event id");
      }
    } catch (error) {
      console.error(error);
      const innerError = error as {
        response: { data: { error: string } };
        message: string;
      };
      toast.error(innerError.response?.data?.error || "Problem has occured");
    }
  };

  const loadLayout = async () => {
    try {
      const loadedElements = currentEvent?.diagram?.elements;
      setElements(loadedElements || []);
    } catch (error) {
      console.error("Failed to load layout:", error);
      setElements([]);
    }
  };

  useEffect(() => {
    loadLayout();
  }, []);

  return (
    <Box style={{ display: "flex", direction: "rtl", flex: "1 1" }}>
      <Box
        ref={canvasRef}
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "#fff",
          border: "1px solid rgb(230, 229, 229)",
        }}
      >
        {elements.map((el, index) => (
          <RndElement
            key={el.id}
            element={el}
            tableNumber={index + 1}
            onUpdate={updateElement}
            onDelete={deleteElement}
          />
        ))}
      </Box>

      <Box
        style={{
          padding: "1.5rem",
          backgroundColor: "#f8f8f8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Text fw={700}>Menu</Text>
          {elementTypes.map((el) => (
            <Button
              key={el.type}
              fullWidth
              className="primary-btn"
              style={{ fontSize: "14px" }}
              onClick={() => {
                setSelectedType(el.type);
                setDrawerOpened(true);
              }}
            >
              {el.label}
            </Button>
          ))}
        </div>

        <Button
          className="primary-btn"
          style={{ fontSize: "14px" }}
          fullWidth
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>

      <Drawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        title="הוספת שולחן"
        position="left"
      >
        {selectedType && (
          <NumberInput
            label="מספר מקומות"
            value={seatCount}
            onChange={setSeatCount}
            min={1}
          />
        )}
        <Button color="#6a0572" fullWidth mt="md" onClick={addElement}>
          הוסף
        </Button>
      </Drawer>
    </Box>
  );
};

export default TableArrangement;
