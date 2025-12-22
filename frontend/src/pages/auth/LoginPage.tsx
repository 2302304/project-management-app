import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Virheellinen sähköpostiosoite'),
  password: z.string().min(6, 'Salasanan on oltava vähintään 6 merkkiä'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const { login, isLoginLoading, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Kirjaudu sisään</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {loginError && (
              <p className="text-sm text-destructive">
                Virheelliset kirjautumistiedot
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? 'Kirjaudutaan...' : 'Kirjaudu'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Eikö sinulla ole tiliä?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Rekisteröidy
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};