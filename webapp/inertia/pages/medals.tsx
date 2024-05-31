import styled from '@emotion/styled';
import { Head } from '@inertiajs/react';
import ContentLayout from '~/layout/content_layout';

const Legend = styled.span({
  fontSize: '0.9rem',
  fontWeight: 400,
  color: '#888888',
});

export default function MedalsPage() {
  return (
    <ContentLayout>
      <Head title="Médailles par pays" />
      <h1>Médailles par pays</h1>
      <div style={{ overflow: 'auto', marginTop: '1em' }}>
        <table>
          <thead>
            <tr>
              <th>Country</th>
              <th>
                Bronze <Legend>Medals</Legend>
              </th>
              <th>
                Silver <Legend>Medals</Legend>
              </th>
              <th>
                Gold <Legend>Medals</Legend>
              </th>
              <th>
                Total <Legend>Medals</Legend>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>France</td>
              <td>1 000 000 000</td>
              <td>1 000 000 000</td>
              <td>1 000 000 000</td>
              <td>4 000 000 000</td>
            </tr>
            <tr>
              <td>USA</td>
              <td>-12</td>
              <td>-12</td>
              <td>-12</td>
              <td>-48</td>
            </tr>
            <tr>
              <td>Oui</td>
              <td>Non</td>
              <td>Non</td>
              <td>Non</td>
              <td>Ouais</td>
            </tr>
            <tr>
              <td>Bla</td>
              <td>Blo</td>
              <td>Bli</td>
              <td>Blo</td>
              <td>Blu</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={4}>
                Total Medals earned
              </th>
              <td>3 999 999 952</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </ContentLayout>
  );
}
