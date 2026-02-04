import { Select } from "@mantine/core";
import styles from './FilterRoles.module.css'

const roleOptions = [
  { value: "merchant", label: "Merchant" },
  { value: "sub-admin", label: "Sub Admin" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

const FilterRoles = () => {
  return (
    <Select className={styles.filterBtn}
      placeholder="Choose a role"
      data={roleOptions}
      w="200"
    />
  );
};

export default FilterRoles;
