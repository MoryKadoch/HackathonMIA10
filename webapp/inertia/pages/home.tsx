import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';
import ContentLayout from '~/layout/content_layout';

function HomePage() {
  return (
    <>
      <Head title="Homepage" />
      // todo: faire tout plein de graph
    </>
  );
}

HomePage.layout = (page: ReactNode) => <ContentLayout children={page} />;
export default HomePage;
