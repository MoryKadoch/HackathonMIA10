import { ReactNode, useState } from 'react';
import TabItem from '~/components/common/tabs/tab_item';
import TabList from '~/components/common/tabs/tab_list';
import TabPanel from '~/components/common/tabs/tab_panel';

export interface Tab {
  title: string;
  content: ReactNode;
}

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

  const handleTabClick = (index: number) => {
    setActiveTabIndex(index);
  };

  return (
    <div css={{ boxShadow: '3px 5px 15px -4px rgba(102, 102, 102, 0.3)' }}>
      <TabList>
        {tabs.map((tab, index) => (
          <TabItem
            key={index}
            active={index === activeTabIndex}
            onClick={() => handleTabClick(index)}
          >
            {tab.title}
          </TabItem>
        ))}
      </TabList>
      <TabPanel key={tabs[activeTabIndex].title}>
        {tabs[activeTabIndex].content}
      </TabPanel>
    </div>
  );
}
