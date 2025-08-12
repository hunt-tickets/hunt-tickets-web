import * as SubframeCore from "@subframe/core";
import { Avatar } from "../sub/avatar";
import { DropdownMenu } from "../sub/dropdownMenu";
import { IconButton } from "../sub/iconButton";
import { Table as TableComponent } from "../sub/Table";

const Table = () => {
  return (
    <TableComponent
      header={
        <TableComponent.HeaderRow>
          <TableComponent.HeaderCell>Nombre</TableComponent.HeaderCell>
          <TableComponent.HeaderCell>
            Ventas - Últimos 30 días
          </TableComponent.HeaderCell>
          <TableComponent.HeaderCell>Total Vendido</TableComponent.HeaderCell>
          <TableComponent.HeaderCell />
        </TableComponent.HeaderRow>
      }
    >
      <TableComponent.Row>
        <TableComponent.Cell>
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              image="https://res.cloudinary.com/subframe/image/upload/v1711417513/shared/kwut7rhuyivweg8tmyzl.jpg"
              square={true}
            >
              A
            </Avatar>
            <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
              John Doe
            </span>
          </div>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="whitespace-nowrap text-body font-body text-neutral-500">
            $1,250.25
          </span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="text-body font-body text-neutral-500">
            $1,250.25
          </span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherMoreHorizontal"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
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
      <TableComponent.Row>
        <TableComponent.Cell>
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              image="https://res.cloudinary.com/subframe/image/upload/v1711417507/shared/fychrij7dzl8wgq2zjq9.avif"
              square={true}
            >
              A
            </Avatar>
            <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
              Alice Smith
            </span>
          </div>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="whitespace-nowrap text-body font-body text-neutral-500">
            $1,250.25
          </span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="text-body font-body text-neutral-500">$980.36</span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherMoreHorizontal"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
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
      <TableComponent.Row>
        <TableComponent.Cell>
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              image="https://res.cloudinary.com/subframe/image/upload/v1711417514/shared/ubsk7cs5hnnaj798efej.jpg"
              square={true}
            >
              A
            </Avatar>
            <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
              Robert Johnson
            </span>
          </div>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="whitespace-nowrap text-body font-body text-neutral-500">
            $1,250.25
          </span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="text-body font-body text-neutral-500">$875.50</span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherMoreHorizontal"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
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
      <TableComponent.Row>
        <TableComponent.Cell>
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              image="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/m0kfajqpwkfief00it4v.jpg"
              square={true}
            >
              A
            </Avatar>
            <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
              Emma Wilson
            </span>
          </div>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="whitespace-nowrap text-body font-body text-neutral-500">
            $1,250.25
          </span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="text-body font-body text-neutral-500">$750.25</span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherMoreHorizontal"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
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
      <TableComponent.Row>
        <TableComponent.Cell>
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              image="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/btvntvzhdbhpulae3kzk.jpg"
              square={true}
            >
              A
            </Avatar>
            <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
              Michael Brown
            </span>
          </div>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="whitespace-nowrap text-body font-body text-neutral-500">
            $1,250.25
          </span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="text-body font-body text-neutral-500">$620.75</span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherMoreHorizontal"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
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
      <TableComponent.Row>
        <TableComponent.Cell>
          <div className="flex items-center gap-2">
            <Avatar
              size="small"
              image="https://res.cloudinary.com/subframe/image/upload/v1711417512/shared/btvntvzhdbhpulae3kzk.jpg"
              square={true}
            >
              A
            </Avatar>
            <span className="whitespace-nowrap text-body-bold font-body-bold text-default-font">
              Michael Brown
            </span>
          </div>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="whitespace-nowrap text-body font-body text-neutral-500">
            $1,250.25
          </span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <span className="text-body font-body text-neutral-500">$620.75</span>
        </TableComponent.Cell>
        <TableComponent.Cell>
          <div className="flex grow shrink-0 basis-0 items-center justify-end">
            <SubframeCore.DropdownMenu.Root>
              <SubframeCore.DropdownMenu.Trigger asChild={true}>
                <IconButton
                  icon="FeatherMoreHorizontal"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {}}
                />
              </SubframeCore.DropdownMenu.Trigger>
              <SubframeCore.DropdownMenu.Portal>
                <SubframeCore.DropdownMenu.Content
                  side="bottom"
                  align="end"
                  sideOffset={4}
                  asChild={true}
                >
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
    </TableComponent>
  );
};

export default Table;
