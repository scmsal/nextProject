import { Tabs } from "@heroui/react";
import { AddPropertyForm } from "./AddPropertyForm";
import UploadPropertiesForm from "./UploadPropertiesForm";

export default function PropertiesTabs() {
  return (
    <div className="flex flex-col ">
      <h2>Manage properties</h2>

      <Tabs className="w-full max-w-md">
        <Tabs.ListContainer>
          <Tabs.List
            aria-label="Options"
            className=" *:data-[selected=true]:bg-cyan-700
        *:data-[selected=true]:text-white"
          >
            <Tabs.Tab id="form">
              Add Single
              <Tabs.Indicator className="bg-background" />
            </Tabs.Tab>
            <Tabs.Tab id="upload-csv">
              Upload Bulk
              <Tabs.Indicator className="bg-background" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="mt-0 pt-0 " id="form">
          <AddPropertyForm />
        </Tabs.Panel>
        <Tabs.Panel className="mt-0 pt-0  " id="upload-csv">
          <UploadPropertiesForm />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
