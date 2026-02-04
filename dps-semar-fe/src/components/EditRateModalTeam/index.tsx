import { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Flex,
  NumberInput,
  Text,
  Table,
  Center,
} from "@mantine/core";
import { notifications, showNotification } from "@mantine/notifications";
import CommonAPIs from "../../api/common";
import { systemConfig } from "../../api/systemConfig";

interface Errors {
  [key: string]: string;
}

const EditRateModalTeam = ({
  isOpen,
  onClose,
  data,
  triggerReload,
  exitEditMode,
}) => {
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState<Errors>({});
  const [systemProfitRates, setSystemProfitRates] = useState({
    payin: 0,
    payout: 0,
    topup: 0,
  });
  const [directMemberRates, setDirectMemberRates] = useState({
    payin: 0,
    payout: 0,
    topup: 0,
  });
  const [availableRates, setAvailableRates] = useState({
    payin: 0,
    payout: 0,
    topup: 0,
  });
  const [unusedRates, setUnusedRates] = useState({
    payin: 0,
    payout: 0,
    topup: 0,
  });

  const columns = ["SNo.", "Name", "Payin", "Payout", "Topup"];

  const updateRate = (type: string, value: number, id: string) => {
    setRows((prev) => {
      const updatedValues = prev.map((item) => {
        if (id === item?.id) {
          return { ...item, [type]: value };
        } else return item;
      });
      return updatedValues;
    });
  };

  const setError = (rowId: string, field: string, message: string) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${rowId}_${field}`]: message,
    }));
  };

  const clearError = (rowId: string, field: string) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors[`${rowId}_${field}`];
      return newErrors;
    });
  };

  const getDetails = async () => {
    const res = await systemConfig();
    if (res) {
      setSystemProfitRates({
        payin: res.payinSystemProfitRate,
        payout: res.payoutSystemProfitRate,
        topup: 0,
      });
      setDirectMemberRates({
        payin: data[0]?.memberRates?.payin || 0,
        payout: data[0]?.memberRates?.payout || 0,
        topup: data[0]?.memberRates?.topup || 0,
      });
    }
  };

  const calculateAvailableRates = () => {
    setAvailableRates({
      payin: 100 - (systemProfitRates.payin + directMemberRates.payin),
      payout: 100 - (systemProfitRates.payout + directMemberRates.payout),
      topup: 100 - (systemProfitRates.topup + directMemberRates.topup),
    });
  };

  const calculateUnusedRates = () => {
    setUnusedRates({
      payin:
        availableRates.payin -
        rows.reduce((prev, curr) => (prev += curr.payin), 0),
      payout:
        availableRates.payout -
        rows.reduce((prev, curr) => (prev += curr.payout), 0),
      topup:
        availableRates.topup -
        rows.reduce((prev, curr) => (prev += curr.topup), 0),
    });
  };

  const handleSubmit = async () => {
    try {
      const promises = rows.map((row) =>
        CommonAPIs.updateMemberCommissionRates(
          row,
          row.id,
          data[0]?.teamId
        ).then((res: any) => {
          // if (res.data.error && res.data.for === "payin") {
          //   setError(row.id, "payin", res.data.message);
          //   throw new Error(res.data.message);
          // }

          // if (res.data.error && res.data.for === "payout") {
          //   setError(row.id, "payout", res.data.message);
          //   throw new Error(res.data.message);
          // }

          // if (res.data.error && res.data.for === "topup") {
          //   setError(row.id, "topup", res.data.message);
          //   throw new Error(res.data.message);
          // }

          return res;
        })
      );

      await Promise.all(promises);

      notifications.show({
        title: "Success",
        message: "Agent referral rates updated successfully!",
        color: "green",
      });

      onClose();
      triggerReload();
      exitEditMode();
    } catch (error) {
      showNotification({
        title: "Error",
        message: "Failed to update commission rates.",
        color: "red",
      });
      triggerReload();
    }
  };

  const mappedRows = rows?.map((row, index) => (
    <Table.Tr key={row?.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>
        <Center>{row?.name}</Center>
      </Table.Td>
      <Table.Td>
        <Center>
          <NumberInput
            value={row?.payin}
            rightSection={<div style={{ marginRight: "8px" }}>%</div>}
            w={"80px"}
            error={errors[`${row.id}_payin`]}
            onChange={(value) => {
              updateRate("payin", +value, row?.id);
              clearError(row?.id, "payin");
            }}
          />
        </Center>
      </Table.Td>
      <Table.Td>
        <Center>
          <NumberInput
            value={row?.payout}
            rightSection={<div style={{ marginRight: "8px" }}>%</div>}
            w={"80px"}
            error={errors[`${row.id}_payout`]}
            onChange={(value) => {
              updateRate("payout", +value, row?.id);
              clearError(row?.id, "payout");
            }}
          />
        </Center>
      </Table.Td>
      <Table.Td>
        <Center>
          <NumberInput
            value={row?.topup}
            rightSection={<div style={{ marginRight: "8px" }}>%</div>}
            w={"80px"}
            error={errors[`${row.id}_topup`]}
            onChange={(value) => {
              updateRate("topup", +value, row?.id);
              clearError(row?.id, "topup");
            }}
          />
        </Center>
      </Table.Td>
    </Table.Tr>
  ));

  useEffect(() => {
    calculateUnusedRates();
  }, [availableRates, rows]);

  useEffect(() => {
    calculateAvailableRates();
  }, [data, systemProfitRates, directMemberRates]);

  useEffect(() => {
    if (data) {
      const newRows = data
        .filter((item: any) => !item.isRootNode)
        .map((item: any) => {
          const name = item.parentName || item.name;

          const agentRates = item.ratesOfAgent;
          const payinRate = agentRates?.payin || 0;
          const payoutRate = agentRates?.payout || 0;
          const topupRate = agentRates?.topup || 0;

          return {
            id: item.id,
            name: name,
            payin: payinRate,
            payout: payoutRate,
            topup: topupRate,
          };
        });
      setRows(newRows);
    }
    getDetails();
  }, [data]);

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size={"lg"}
      title={
        <Text size="20px" fw={600}>
          Edit Referral Rates
        </Text>
      }
    >
      <Flex direction="column" gap="sm" mt={"md"}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              {columns.map((item) => (
                <Table.Th key={item}>{item}</Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{mappedRows}</Table.Tbody>

          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={2}>
                <Text size={"14px"} c={"slategrey"}>
                  System Profit Rate
                </Text>
              </Table.Td>
              <Table.Td>
                <Center>{systemProfitRates.payin}%</Center>
              </Table.Td>
              <Table.Td>
                <Center>{systemProfitRates.payout}%</Center>
              </Table.Td>
              <Table.Td>
                <Center>{systemProfitRates.topup}%</Center>
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td colSpan={2}>
                <Text size={"14px"} c={"slategrey"}>
                  Direct Member Rate
                </Text>
              </Table.Td>
              <Table.Td>
                <Center>{directMemberRates.payin}%</Center>
              </Table.Td>
              <Table.Td>
                <Center>{directMemberRates.payout}%</Center>
              </Table.Td>
              <Table.Td>
                <Center>{directMemberRates.topup}%</Center>
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td colSpan={2}>
                <Text size={"14px"} c={"slategrey"}>
                  Available Percentage
                </Text>
              </Table.Td>
              <Table.Td>
                <Center>{availableRates.payin}%</Center>
              </Table.Td>
              <Table.Td>
                <Center>{availableRates.payout}%</Center>
              </Table.Td>
              <Table.Td>
                <Center>{availableRates.topup}%</Center>
              </Table.Td>
            </Table.Tr>

            <Table.Tr>
              <Table.Td colSpan={2}>
                <Text size={"14px"} c={"slategrey"}>
                  Unused Percentage
                </Text>
              </Table.Td>
              <Table.Td>
                <Text c={unusedRates.payin < 0 ? "red" : "black"}>
                  {unusedRates.payin}%
                </Text>
              </Table.Td>
              <Table.Td>
                <Text c={unusedRates.payout < 0 ? "red" : "black"}>
                  {unusedRates.payout}%
                </Text>
              </Table.Td>
              <Table.Td>
                <Text c={unusedRates.topup < 0 ? "red" : "black"}>
                  {unusedRates.topup}%
                </Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        {Object.values(unusedRates).some((value) => value < 0) && (
          <Text ta={"center"} c={"red"} mt={"12px"}>
            Unused percentage rates must be equal to or greater than zero!
          </Text>
        )}
        {rows.some(
          (row) => row.payin < 0 || row.payout < 0 || row.topup < 0
        ) && (
          <Text ta={"center"} c={"red"} mt={"12px"}>
            Rates must be from 0 to 100.
          </Text>
        )}
        <Flex justify={"center"} gap={"lg"} mt={"md"}>
          <Button variant="light" w={"100%"} onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            w={"100%"}
            // disabled={Object.values(unusedRates).some((value) => value < 0)}
            disabled={
              Object.values(unusedRates).some((value) => value < 0) ||
              rows.some(
                (row) => row.payin < 0 || row.payout < 0 || row.topup < 0
              )
            }
          >
            Update
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};

export default EditRateModalTeam;
