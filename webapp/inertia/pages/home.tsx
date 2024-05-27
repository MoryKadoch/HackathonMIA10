import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Home(props: { version: number }) {
  useEffect(() => {
    console.log('oui');
  }, []);
  return (
    <>
      <Head title="Homepage" />

      <div className="container">
        <div className="title">AdonisJS {props.version} x Inertia x React</div>
        <button onClick={() => console.log('click')}>a</button>
        <span>
          Learn more about AdonisJS and Inertia.js by visiting the{' '}
          <a href="https://docs.adonisjs.com/guides/inertia">
            AdonisJS documentation
          </a>
          .
        </span>
      </div>
    </>
  );
}
