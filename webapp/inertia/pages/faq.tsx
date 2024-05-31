import { Head } from '@inertiajs/react';
import AccordionItem from '~/components/common/accordion/accordion_item';
import AccordionWrapper from '~/components/common/accordion/accordion_wrapper';
import { FAQ_LIST } from '~/constants/faq_list';
import ContentLayout from '~/layout/content_layout';

const FAQPage = () => (
  <ContentLayout>
    <Head title="Foire aux Questions" />
    <h1>Foire aux Questions</h1>
    <p>
      Bienvenue dans notre section FAQ. Vous trouverez ici les réponses aux
      questions les plus courantes concernant notre projet de hackathon.
    </p>
    <AccordionWrapper>
      {FAQ_LIST.map(({ header, content }) => (
        <AccordionItem header={header}>{content}</AccordionItem>
      ))}
    </AccordionWrapper>
  </ContentLayout>
);

export default FAQPage;
