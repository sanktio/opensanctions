import Link from 'next/link'
import Table from 'react-bootstrap/Table'

import { IDataset, ICollection, isSource, IDatasetDetails } from '../lib/types'
import { FormattedDate, HelpLink, Numeric, Plural, Spacer, URLLink } from './util'
import { wordList } from '../lib/util'

import styles from '../styles/Dataset.module.scss'


type DatasetScreenProps = {
  dataset: IDataset
  details: IDatasetDetails
  collections?: Array<ICollection>
}

export default function DatasetMetadataTable({ dataset, details, collections }: DatasetScreenProps) {
  const schemaList = wordList(details.targets.schemata.map((ts) =>
    <span className={styles.noWrap}>
      <a href={`/search/?scope=${dataset.name}&schema=${ts.name}`}>
        <Plural value={ts.count} one={ts.label} many={ts.plural} />
      </a>
      <HelpLink href={`/reference/#schema.${ts.name}`} />
    </span>
  ), <Spacer />);
  return (
    <Table responsive="md">
      <tbody>
        <tr>
          <th className={styles.tableHeader}>
            Targets<HelpLink href="/reference/#targets" />:
          </th>
          <td>
            {details.targets.schemata.length == 1 && schemaList}
            {details.targets.schemata.length > 1 && (
              <>
                {schemaList}
                <>
                  (<Numeric value={dataset.target_count} /> total)
                </>
              </>
            )}
          </td>
        </tr>
        {isSource(dataset) && (
          <tr>
            <th className={styles.tableHeader}>Publisher:</th>
            <td>
              <URLLink url={dataset.publisher.url} label={dataset.publisher.name} icon={false} />
              {dataset.publisher.country !== 'zz' && (
                <> ({dataset.publisher.country_label})</>
              )}
              <p className={styles.publisherDescription}>{dataset.publisher.description}</p>
            </td>
          </tr>
        )}
        {isSource(dataset) && !!dataset.url && (
          <tr>
            <th className={styles.tableHeader}>Information:</th>
            <td>
              <URLLink url={dataset.url} />
            </td>
          </tr>
        )}
        {isSource(dataset) && dataset.data.url && (
          <tr>
            <th className={styles.tableHeader}>Source data:</th>
            <td>
              <URLLink url={dataset.data.url} />
              <> ({dataset.data.format})</>
            </td>
          </tr>
        )}
        {isSource(dataset) && !!collections?.length && (
          <tr>
            <th className={styles.tableHeader}>
              Collections<HelpLink href="/docs/faq/#collections" />:
            </th>
            <td>
              <>included in </>
              {wordList(collections.map((collection) =>
                <Link href={collection.link}>
                  {collection.title}
                </Link>
              ), <Spacer />)}
            </td>
          </tr>
        )}
        <tr>
          <th className={styles.tableHeader}>Last changed<HelpLink href="/docs/faq/#updates" />:</th>
          <td><FormattedDate date={dataset.last_change} /></td>
        </tr>
      </tbody>
    </Table >

  )
}
