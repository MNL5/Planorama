import React, { useState, useMemo, useTransition } from "react";
import { Flex, Box, SegmentedControl, Text } from "@mantine/core";
import { toast } from "react-toastify";

import { useEventContext } from "../../contexts/event-context";
import useGuestData from "../../hooks/useGuestData";

<<<<<<< HEAD
import UnassignedGuestsPanel from '../UnassignedGuestsPanel/UnassignedGuestsPanel';
import ElementsCanvas from '../ElementsCanvas/ElementsCanvas';
=======
import UnassignedGuestsPanel from "../UnassignedGuestsPanel/UnassignedGuestsPanel";
import TableCanvas from "../TableCanvas/TableCanvas";
>>>>>>> 47d130a41d5932d8f80d5f5fcf563a2654645665

import {
  computeTableAverage,
  satisfactionToColor,
} from "../../utils/satisfactionUtils";
import { RsvpStatus } from "../../types/rsvp-status";

import "./GuestSeating.css";
import MainLoader from "../mainLoader/MainLoader";

type ViewMode = "regular" | "satisfaction";

const GuestSeating: React.FC = () => {
  const { currentEvent } = useEventContext();
  const [viewMode, setViewMode] = useState<ViewMode>("regular");
  const [openTableId, setOpenTableId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    guests,
    setGuests,
    elements,
    satisfactionMap,
    isLoading,
    isError,
    handleSaveSeating,
    handleAutoAssign,
  } = useGuestData(currentEvent, viewMode);

  const guestsToShow = useMemo(
    () => guests.filter((g) => !g.tableId && g.status !== RsvpStatus.DECLINE),
    [guests],
  );

  if (isLoading) {
    return <MainLoader isPending />;
  }
  if (isError) {
    return <Text className="gs-error-text">Error loading data.</Text>;
  }

  const handleDrop = (tableId: string, ids: string[]) => {
    const idSet = new Set(ids);
    setGuests((prev) =>
      prev.map((g) => (idSet.has(g.id) ? { ...g, tableId } : g)),
    );
  };

  const handleRemove = (guestId: string) => {
    setGuests((prev) =>
      prev.map((g) => (g.id === guestId ? { ...g, tableId: undefined } : g)),
    );
  };

  const totalSeats = elements.reduce((sum, el) => sum + (el.seatCount || 0), 0);
  const canAutoAssign = guestsToShow.length <= totalSeats;

  return (
    <Flex className="gs-container" onClick={() => setOpenTableId(null)}>
      <MainLoader isPending={isPending} />

      <UnassignedGuestsPanel
        guestsToShow={guestsToShow}
        onAutoAssign={() => {
          if (!canAutoAssign) {
            toast.error("Not enough seats for all guests");
            return;
          }
          startTransition(() => handleAutoAssign());
        }}
        onSave={() => startTransition(() => handleSaveSeating())}
      />

<<<<<<< HEAD
                <ElementsCanvas
                    elements={elements}
                    guests={guests}
                    satisfactionMap={satisfactionMap}
                    viewMode={viewMode}
                    openTableId={openTableId}
                    onOpenTable={(id) => setOpenTableId(id)}
                    onCloseTable={() => setOpenTableId(null)}
                    onDrop={handleDrop}
                    onRemove={handleRemove}
                    computeTableAverage={computeTableAverage}
                />
            </Box>
        </Flex>
    );
=======
      <Box className="gs-canvas">
        <SegmentedControl
          value={viewMode}
          onChange={(val) => setViewMode(val as ViewMode)}
          data={[
            { label: "Regular", value: "regular" },
            { label: "Satisfaction", value: "satisfaction" },
          ]}
          className="gs-view-switch"
        />

        <TableCanvas
          elements={elements}
          guests={guests}
          satisfactionMap={satisfactionMap}
          viewMode={viewMode}
          openTableId={openTableId}
          onOpenTable={(id) => setOpenTableId(id)}
          onCloseTable={() => setOpenTableId(null)}
          onDrop={handleDrop}
          onRemove={handleRemove}
          computeTableAverage={computeTableAverage}
          satisfactionToColor={satisfactionToColor}
        />
      </Box>
    </Flex>
  );
>>>>>>> 47d130a41d5932d8f80d5f5fcf563a2654645665
};

export default GuestSeating;
