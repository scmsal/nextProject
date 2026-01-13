import { Tabs } from "@heroui/react";
import UploadListingsForm from "./UploadListingsForm";
import AddListingForm from "./AddListingForm";

export function ListingsTabs() {
  return (
    <div className="flex flex-col ">
      <h2>Manage listings</h2>
      <Tabs className="w-full max-w-md">
        <Tabs.ListContainer className="mb-0">
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
              <Tabs.Indicator className="bg-background m-0" />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="mt-0 pt-0 " id="form">
          <AddListingForm />
        </Tabs.Panel>
        <Tabs.Panel className="mt-0 pt-0  " id="upload-csv">
          <UploadListingsForm />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
