import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const registerSchema = z.object({
  firstName: z.string().min(1, 'Etunimi on pakollinen'),
  lastName: z.string().min(1, 'Sukunimi on pakollinen'),
  email: z.string().email('Virheellinen sähköpostiosoite'),
  password: z.string().min(6, 'Salasanan on oltava vähintään 6 merkkiä'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const { register: registerUser, isRegisterLoading, registerError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Luo tili</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Etunimi"
                {...register('firstName')}
                error={errors.firstName?.message}
                placeholder="Matti"
              />
              <Input
                label="Sukunimi"
                {...register('lastName')}
                error={errors.lastName?.message}
                placeholder="Meikäläinen"
              />
            </div>

            <Input
              label="Sähköposti"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="nimi@esimerkki.fi"
            />

            <Input
              label="Salasana"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="••••••••"
            />

            {registerError && (
              <p className="text-sm text-destructive">
                Rekisteröinti epäonnistui. Sähköposti saattaa olla jo käytössä.
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isRegisterLoading}
            >
              {isRegisterLoading ? 'Luodaan tiliä...' : 'Rekisteröidy'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Onko sinulla jo tili?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Kirjaudu sisään
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};