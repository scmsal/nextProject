import { Tabs } from "@heroui/react";
import UploadListingsForm from "./UploadListingsForm";
import AddListingForm from "./AddListingForm";

export function ListingsTabs() {
  return (
    <div className="flex flex-col ">
      <span>2nd</span>
      <h2>Manage listings</h2>
      <Tabs className="w-full md:w-5xl max-w-md">
        <Tabs.ListContainer className="mb-0">
          <Tabs.List aria-label="Options" className="text-accent">
            <Tabs.Tab id="form">
              Add Single
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="upload-csv">
              Upload Bulk
              <Tabs.Indicator className=" m-0" />
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
