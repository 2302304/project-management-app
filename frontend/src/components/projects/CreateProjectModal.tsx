import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useProjects } from '../../hooks/useProjects';
import { X } from 'lucide-react';

const projectSchema = z.object({
  name: z.string().min(1, 'Nimi on pakollinen'),
  description: z.string().optional(),
  color: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectModalProps {
  onClose: () => void;
}

export const CreateProjectModal = ({ onClose }: CreateProjectModalProps) => {
  const { createProject, isCreating } = useProjects();
  const [selectedColor, setSelectedColor] = useState('#3B82F6');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16',
  ];

  const onSubmit = (data: ProjectFormData) => {
    createProject(
      { ...data, color: selectedColor },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Uusi projekti</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Projektin nimi"
            {...register('name')}
            error={errors.name?.message}
            placeholder="Esim. Verkkosivuston uudistus"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Kuvaus (valinnainen)
            </label>
            <textarea
              {...register('description')}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
              placeholder="Projektin kuvaus..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Väri
            </label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? 'border-foreground scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Peruuta
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="flex-1"
            >
              {isCreating ? 'Luodaan...' : 'Luo projekti'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};