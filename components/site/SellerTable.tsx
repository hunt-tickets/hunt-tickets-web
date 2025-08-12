import { Avatar } from "../sub/avatar";
import { DropdownMenu } from "../sub/dropdownMenu";
import { IconButton } from "../sub/iconButton";
import * as SubframeCore from "@subframe/core";
import { Table as TableComponent } from "../sub/Table";
import DataGrid from "./DataGrid";

const SellerTable = () => {
  const columns = ["Nombre", "Ventas - Últimos 30 días", "Total Vendido", "Acciones"];

  const data = [
    {
      name: "John Doe",
      image: "https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg",
      sales: "$1,250.25",
      total: "$1,250.25",
    },
    {
      name: "Alice Smith",
      image: "https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif",
      sales: "$980.36",
      total: "$980.36",
    },
    {
      name: "Robert Johnson",
      image: "https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg",
      sales: "$875.50",
      total: "$875.50",
    },
  ];

  const renderRow = (user: typeof data[0], index: number) => (
    <TableComponent.Row key={index}>
      <TableComponent.Cell>
        <div className="flex items-center gap-2">
          <Avatar size="small" image={user.image} square={true}>
            {user.name[0]}
          </Avatar>
          <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
            {user.name}
          </span>
        </div>
      </TableComponent.Cell>
      <TableComponent.Cell>
        <span className="whitespace-nowrap text-body font-body text-neutral-500">
          {user.sales}
        </span>
      </TableComponent.Cell>
      <TableComponent.Cell>
        <span className="text-body font-body text-neutral-500">{user.total}</span>
      </TableComponent.Cell>
      <TableComponent.Cell>
        <div className="flex grow shrink-0 basis-0 items-center justify-end">
          <SubframeCore.DropdownMenu.Root>
            <SubframeCore.DropdownMenu.Trigger asChild={true}>
              <IconButton icon="FeatherMoreHorizontal" />
            </SubframeCore.DropdownMenu.Trigger>
            <SubframeCore.DropdownMenu.Portal>
              <SubframeCore.DropdownMenu.Content side="bottom" align="end" sideOffset={4} asChild={true}>
                <DropdownMenu>
                  <DropdownMenu.DropdownItem icon="FeatherTrash">
                    Eliminar
                  </DropdownMenu.DropdownItem>
                </DropdownMenu>
              </SubframeCore.DropdownMenu.Content>
            </SubframeCore.DropdownMenu.Portal>
          </SubframeCore.DropdownMenu.Root>
        </div>
      </TableComponent.Cell>
    </TableComponent.Row>
  );

  return <DataGrid columns={columns} data={data} renderRow={renderRow} />;
};

export default SellerTable;