import { Button } from "./Button";

export function RoleButton({ role, selectedUser }) {
  switch (role) {
    case "Мирний":
      return (
        <div className="ready_button">
          <Button variant="secondary" disabled size="medium">
            Мирний
          </Button>
        </div>
      );
    case "Самогубець":
      <div className="ready_button">
        <Button variant="secondary" disabled size="medium">
          Самогубець
        </Button>
      </div>;
    case "Камікадзе":
      <div className="ready_button">
        <Button variant="secondary" disabled size="medium">
          Камікадзе
        </Button>
      </div>;
    case "Дон":
      return (
        <div className="ready_button">
          <Button variant="secondary" size="medium">
            Вбити гравця
          </Button>
        </div>
      );
    case "Мафія":
      <div className="ready_button">
        <Button variant="secondary" size="medium">
          Висунути пропозицію
        </Button>
      </div>;
    case "Комісар":
      <div className="ready_button">
        <Button variant="secondary" size="medium">
          Перевірити гравця
        </Button>
      </div>;
    case "Сержант":
      <div className="ready_button">
        <Button variant="secondary" size="medium">
          Сержантувати
        </Button>
      </div>;
    case "Доктор":
      <div className="ready_button">
        <Button variant="secondary" size="medium">
          Полікувати гравця
        </Button>
      </div>;
    case "Коханка":
      <div className="ready_button">
        <Button variant="secondary" size="medium">
          Відвідати гравця
        </Button>
      </div>;
    case "Безхатько":
      <div className="ready_button">
        <Button variant="secondary" size="medium">
          Відвідати гравця
        </Button>
      </div>;
    case "Маніак":
      <div className="ready_button">
        <Button variant="secondary" size="medium">
          Вбити гравця
        </Button>
      </div>;
    case "Адвокат":
      <div className="ready_button">
        <Button variant="secondary" size="medium">
          Захищати гравця
        </Button>
      </div>;
    default:
      return <div> Невідома роль</div>;
  }
}
