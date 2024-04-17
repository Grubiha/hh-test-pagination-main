import Head from "next/head";
import { Inter } from "next/font/google";
import { Alert, Container, Table, Pagination } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  resp: {
    users: TUserItem[];
    count: number;
  };

  page?: number;
};
const limit = 20;

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const { query } = ctx;
    const page = query.page || 1;
    const sort_by = query.sort_by || "id";
    const sort_order = query.sort_order || "asc";

    const res = await fetch(
      `http://localhost:3000/users?limit=${limit}&page=${page}&sort_by=${sort_by}&sort_order=${sort_order}`,
      { method: "GET" }
    );
    if (!res.ok) {
      return { props: { statusCode: res.status, resp: { users: [], count: 0 } } };
    }

    return {
      props: { statusCode: 200, resp: await res.json(), page: +page },
    };
  } catch (e) {
    return { props: { statusCode: 500, resp: { users: [], count: 0 } } };
  }
}) satisfies GetServerSideProps<TGetServerSideProps>;

export default function Home({ statusCode, resp, page = 1 }: TGetServerSideProps) {
  console.log("rerender");
  const router = useRouter();

  const genPaginationList = (pageNumber = page) => {
    const pagination = [];
    let start = pageNumber - (pageNumber % 10);
    if (start != 0 && pageNumber % 10 == 0) start = start - 10;
    let end = start + 10;
    if (end > Math.ceil(resp.count / limit)) end = Math.ceil(resp.count / limit);
    for (let number = start + 1; number <= end; number++) {
      pagination.push(number);
    }
    return pagination;
  };
  
  const [paginationList, setPaginationList] = useState(genPaginationList);

  const pageChange = (pageNumber: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: pageNumber },
    });
    if (!paginationList.includes(pageNumber)) {
      const list = genPaginationList(pageNumber);
      console.log(list);
      setPaginationList(list);
    }
  };

  const paginationListUp = () => {
    const list = genPaginationList(paginationList[0] + 10);
    console.log(list);
    setPaginationList(list);
  };

  const paginationListDown = () => {
    const list = genPaginationList(paginationList[0] - 10);
    console.log(list);
    setPaginationList(list);
  };

  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {resp.users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            <Pagination.First onClick={() => paginationListDown()} disabled={paginationList.includes(1)} />
            <Pagination.Prev onClick={() => pageChange(page - 1)} disabled={page == 1} />

            {paginationList.map((number) => (
              <Pagination.Item key={number} active={number === page} onClick={() => pageChange(number)}>
                {number}
              </Pagination.Item>
            ))}

            <Pagination.Next onClick={() => pageChange(page + 1)} disabled={page == Math.ceil(resp.count / limit)} />
            <Pagination.Last
              onClick={() => paginationListUp()}
              disabled={paginationList.includes(Math.ceil(resp.count / limit))}
            />
          </Pagination>
        </Container>
      </main>
    </>
  );
}
