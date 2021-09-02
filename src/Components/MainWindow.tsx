import * as React from "react";
import { Container, HStack, Kbd } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { BiCodeBlock as CodeIcon } from "react-icons/bi";
import { BsPencil as EditIcon } from "react-icons/bs";
import { IoMdCheckmarkCircleOutline as CheckIcon } from "react-icons/io";
import Sidebar from "./Cases/Sidebar/Sidebar";
import Main from "./Cases/Main";
import WritingWindow from "./Writing/WritingWindow";
import SolutionMainWindow from "./Solution/SolutionMainWindow";
import { useStoreActions, useStoreState } from "../Redux/Store";
import { useEffect, useState } from "react";

const MainWindow = () => {
  const [localTab, setLocalTab] = useState(0);

  const setTab = useStoreActions((actions) => actions.tabs.setTab);
  const tabIndex = useStoreState((state) => state.tabs.tabIndex);

  useEffect(() => {
    setLocalTab(tabIndex);
  }, []);

  useEffect(() => {
    window.addEventListener("keyup", handleShorcuts);
    return () => {
      window.removeEventListener("keyup", handleShorcuts);
    };
  }, []);

  function handleShorcuts(key: KeyboardEvent) {
    console.log(key.which); // 81 87 69
    if (key.ctrlKey) {
      if (key.which === 81) {
        setLocalTab(0);
      }
      if (key.which === 87) {
        setLocalTab(1);
      }
      if (key.which === 69) {
        setLocalTab(2);
      }
    }
  }

  return (
    <>
      <Container maxW={"container.lg"} mt={3} h={"80vh"} padding={"0"}>
        <Tabs
          variant={"enclosed"}
          size={"sm"}
          index={localTab}
          onChange={(e) => {
            //console.log(e);
            setTab(e);
            setLocalTab(e);
          }}
        >
          <TabList>
            <Tab>
              <HStack>
                <CodeIcon />
                <p>Código Solución</p>
                <span>
                  <Kbd>Ctrl</Kbd>+<Kbd>Q</Kbd>
                </span>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <CheckIcon />
                <p>Casos de Prueba</p>
                <span>
                  <Kbd>Ctrl</Kbd>+<Kbd>W</Kbd>
                </span>
              </HStack>
            </Tab>
            <Tab>
              <HStack>
                <EditIcon />
                <p>Redacción</p>
                <span>
                  <Kbd>Ctrl</Kbd>+<Kbd>E</Kbd>
                </span>
              </HStack>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <SolutionMainWindow />
            </TabPanel>
            <TabPanel>
              <Main />
            </TabPanel>
            <TabPanel>
              <WritingWindow />
            </TabPanel>
          </TabPanels>
        </Tabs>
        {/*<Sidebar />*/}
      </Container>
    </>
  );
};

export default MainWindow;
