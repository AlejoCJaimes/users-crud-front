import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { LoginPayload, login } from "../../api/login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formPayload, setFormPayload] = useState<LoginPayload>({
    username: '',
    password: ''
  })

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(formPayload);
      navigate('/dashboard/users');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form className="h-full w-full flex flex-col items-center justify-center" onSubmit={onSubmit}>
      <Card className="w-1/2">
        <CardBody className="flex flex-col gap-4 items-center px-14 py-20">
          <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
          <Divider />
          <Input
            type="email"
            placeholder="Email"
            label="Email"
            isRequired
            value={formPayload.username}
            onChange={(e) => setFormPayload({ ...formPayload, username: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            label="Password"
            isRequired
            value={formPayload.password}
            onChange={(e) => setFormPayload({ ...formPayload, password: e.target.value })}
          />
          <Button
            color="primary"
            className="w-max"
            type="submit"
          >
            Inicio de sesión
          </Button>
        </CardBody>
      </Card>
    </form>
  );
}