import { Header } from "./Header";
export function Layout({ children }) {
  return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
      <footer>Я футер</footer>
    </div>
  );
}
