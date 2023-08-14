type KeyValue = { [key: string]: string };

const Table = ({
  headers,
  items = [],
  exclude = [],
}: {
  headers: KeyValue;
  items: unknown[];
  exclude: string[];
}) => {
  return (
    <table>
      <thead>
        <tr>
          {Object.keys(headers || {})
            .filter((item) => !exclude.includes(item))
            .map((headerKey: string) => {
              return (
                <th
                  key={headerKey}
                  style={{
                    backgroundColor: "#d6d6d6",
                    whiteSpace: "nowrap",
                  }}
                >
                  {headers[headerKey]}
                </th>
              );
            })}
        </tr>
      </thead>

      <tbody>
        {items.map((item: any) => (
          <tr key={item.id}>
            {Object.keys(headers || {})
              .filter((item) => !exclude.includes(item))
              .map((headerKey: string) => (
                <td
                  key={headerKey}
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {item[headerKey]}
                </td>
              ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
