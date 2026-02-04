import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { MdOutlineClear } from "react-icons/md";
import {
  Channels,
  Statuses,
  StatusesWithdrawal,
} from "../../../../hook/usePagination/filterData";

const Filter = ({
  opened,
  close,
  reset,
  handleChange,
  statuses,
  channels,
  lowerAmount,
  upperAmount,
  madeVia,
  apply,
  withdrawalFilters = false,
  topupFilters = false,
  memberFilter,
  merchantFilter,
  gatewayFilter,
  filterGatewayArray = [],
  filterMemberSearch = "",
  filterMerchantSearch = "",
}) => {
  return (
    <Modal opened={opened} onClose={close} withCloseButton={false} title="">
      <Box mb={"lg"}>
        <Title order={3}>Select filters</Title>
        <Text size="sm" c={"gray"}>
          Filter data from the following options
        </Text>
      </Box>

      <Stack mb={"sm"}>
        {merchantFilter && (
          <TextInput
            label="Merchant name"
            placeholder="Enter merchant name"
            value={filterMerchantSearch}
            onChange={(v) =>
              handleChange("filterMerchantSearch", v.target.value)
            }
          ></TextInput>
        )}
        <MultiSelect
          label="Select channels: "
          placeholder="Pick values"
          data={Channels}
          hidePickedOptions
          value={channels}
          onChange={(v) => handleChange("channels", v)}
        />

        {!topupFilters && (
          <MultiSelect
            label="Select statuses: "
            placeholder="Pick values"
            data={withdrawalFilters ? StatusesWithdrawal : Statuses}
            hidePickedOptions
            value={statuses}
            onChange={(v) => handleChange("statuses", v)}
          />
        )}

        {!topupFilters && !withdrawalFilters && (
          <Radio.Group
            label="Order Via"
            description="This filter has no effect on orders that have not been assigned yet"
            value={madeVia}
            onChange={(v) => {
              handleChange("madeVia", v);
              if (v === "MEMBER" || v === "BOTH" || v === "UPI_VENDOR") {
                handleChange("filterMemberSearch", "");
                handleChange("filterGatewayArray", null);
              }

              if (v === "GATEWAY") {
                handleChange("filterGatewayArray", [
                  "RAZORPAY",
                  "PHONEPE",
                  "UNIQPAY",
                  "PAYU",
                ]);
              }
            }}
          >
            <Group mt="xs">
              <Radio
                value="BOTH"
                label={`${
                  withdrawalFilters ? "Offline Remmitance" : "Members"
                } & Gateways`}
              />
              {withdrawalFilters && (
                <Radio value="ADMIN" label="Offline Remmitance" />
              )}
              {!withdrawalFilters && <Radio value="MEMBER" label="Members" />}
              <Radio value="GATEWAY" label="Gateways" />
              {!withdrawalFilters && <Radio value="UPI_VENDOR" label="UPI Vendor" />}
            </Group>
            {memberFilter && madeVia === "MEMBER" && (
              <TextInput
                size="xs"
                mt={"xs"}
                placeholder="Enter Member Name"
                value={filterMemberSearch}
                onChange={(v) =>
                  handleChange("filterMemberSearch", v.target.value)
                }
              ></TextInput>
            )}

            {gatewayFilter && madeVia === "GATEWAY" && (
              <MultiSelect
                data={[
                  { value: "RAZORPAY", label: "RAZORPAY" },
                  { value: "PHONEPE", label: "PHONEPE" },
                  { value: "UNIQPAY", label: "BenakPay" },
                  { value: "PAYU", label: "PAYU" },
                ]}
                placeholder="Pick values"
                size="xs"
                mt={"xs"}
                value={filterGatewayArray}
                onChange={(v) => handleChange("filterGatewayArray", v)}
              ></MultiSelect>
            )}
          </Radio.Group>
        )}

        <Box>
          <Text size="sm" fw={500}>
            Amount Range
          </Text>

          <Flex align={"center"} gap={"md"}>
            <NumberInput
              min={1}
              max={1000000000}
              placeholder="Min amount"
              onChange={(v) => handleChange("lowerAmount", v)}
              value={lowerAmount}
            />
            <Text size="sm">To</Text>
            <NumberInput
              min={1}
              max={1000000000}
              placeholder="Max amount"
              onChange={(v) => handleChange("upperAmount", v)}
              value={upperAmount}
            />
          </Flex>
        </Box>
      </Stack>

      <Button
        variant="light"
        mt={"sm"}
        leftSection={<MdOutlineClear />}
        onClick={reset}
      >
        Reset all filters
      </Button>

      <Flex gap={"md"} mt={"lg"} justify={"space-between"} align={"center"}>
        <Button w={"100%"} variant="outline" onClick={close}>
          Close{" "}
        </Button>
        <Button
          w={"100%"}
          onClick={() => {
            apply();
            close();
          }}
        >
          Apply
        </Button>
      </Flex>
    </Modal>
  );
};

export default Filter;
