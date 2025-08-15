"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Range, Root, Thumb, Track } from '@radix-ui/react-slider';
import Color from 'color';
import { PipetteIcon } from 'lucide-react';
import {
  type ChangeEventHandler,
  type ComponentProps,
  type HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createContext, useContext } from 'react';

interface ColorPickerContextValue {
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;
  mode: string;
  setHue: (hue: number) => void;
  setSaturation: (saturation: number) => void;
  setLightness: (lightness: number) => void;
  setAlpha: (alpha: number) => void;
  setMode: (mode: string) => void;
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
  undefined
);

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext);

  if (!context) {
    throw new Error('useColorPicker must be used within a ColorPickerProvider');
  }

  return context;
};

export type ColorPickerProps = HTMLAttributes<HTMLDivElement> & {
  value?: Parameters<typeof Color>[0];
  defaultValue?: Parameters<typeof Color>[0];
  onChange?: (value: string) => void;
};

export const ColorPicker = ({
  value,
  defaultValue = '#000000',
  onChange,
  className,
  ...props
}: ColorPickerProps) => {
  const initialColor = value ? Color(value) : Color(defaultValue);
  
  const [hue, setHue] = useState(initialColor.hue() || 0);
  const [saturation, setSaturation] = useState(initialColor.saturationl() || 100);
  const [lightness, setLightness] = useState(initialColor.lightness() || 50);
  const [alpha, setAlpha] = useState(initialColor.alpha() * 100);
  const [mode, setMode] = useState('hex');

  const handleColorChange = useCallback(() => {
    if (onChange) {
      const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
      onChange(color.hex());
    }
  }, [hue, saturation, lightness, alpha, onChange]);

  const handleHueChange = useCallback((newHue: number) => {
    setHue(newHue);
    const color = Color.hsl(newHue, saturation, lightness).alpha(alpha / 100);
    onChange?.(color.hex());
  }, [saturation, lightness, alpha, onChange]);

  const handleSaturationChange = useCallback((newSaturation: number) => {
    setSaturation(newSaturation);
    const color = Color.hsl(hue, newSaturation, lightness).alpha(alpha / 100);
    onChange?.(color.hex());
  }, [hue, lightness, alpha, onChange]);

  const handleLightnessChange = useCallback((newLightness: number) => {
    setLightness(newLightness);
    const color = Color.hsl(hue, saturation, newLightness).alpha(alpha / 100);
    onChange?.(color.hex());
  }, [hue, saturation, alpha, onChange]);

  const handleAlphaChange = useCallback((newAlpha: number) => {
    setAlpha(newAlpha);
    const color = Color.hsl(hue, saturation, lightness).alpha(newAlpha / 100);
    onChange?.(color.hex());
  }, [hue, saturation, lightness, onChange]);

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setHue: handleHueChange,
        setSaturation: handleSaturationChange,
        setLightness: handleLightnessChange,
        setAlpha: handleAlphaChange,
        setMode,
      }}
    >
      <div className={cn('grid w-full gap-4', className)} {...props} />
    </ColorPickerContext.Provider>
  );
};

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerSelection = ({
  className,
  ...props
}: ColorPickerSelectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { hue, saturation, lightness, setSaturation, setLightness } = useColorPicker();

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      if (!isDragging || !containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width)
      );
      const y = Math.max(
        0,
        Math.min(1, (event.clientY - rect.top) / rect.height)
      );

      setPosition({ x, y });
      setSaturation(x * 100);
      setLightness((1 - y) * 100);
    },
    [isDragging, setSaturation, setLightness]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', () => setIsDragging(false));
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', () => setIsDragging(false));
    };
  }, [isDragging, handlePointerMove]);

  // Update position when saturation/lightness changes externally
  useEffect(() => {
    setPosition({
      x: saturation / 100,
      y: 1 - lightness / 100
    });
  }, [saturation, lightness]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-[4/3] w-full cursor-crosshair rounded',
        className
      )}
      style={{
        background: `linear-gradient(0deg,rgb(0,0,0),transparent),linear-gradient(90deg,rgb(255,255,255),hsl(${hue},100%,50%))`,
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
        handlePointerMove(e.nativeEvent);
      }}
      {...props}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 rounded-full border-2 border-white"
        style={{
          left: `${position.x * 100}%`,
          top: `${position.y * 100}%`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
        }}
      />
    </div>
  );
};

export type ColorPickerHueProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerHue = ({
  className,
  ...props
}: ColorPickerHueProps) => {
  const { hue, setHue } = useColorPicker();

  return (
    <Root
      value={[hue]}
      max={360}
      step={1}
      className={cn('relative flex h-4 w-full touch-none', className)}
      onValueChange={([hue]) => setHue(hue)}
      {...props}
    >
      <Track className="relative my-0.5 h-3 w-full grow rounded-full bg-[linear-gradient(90deg,#FF0000,#FFFF00,#00FF00,#00FFFF,#0000FF,#FF00FF,#FF0000)]">
        <Range className="absolute h-full" />
      </Track>
      <Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
    </Root>
  );
};

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>;

export const ColorPickerFormat = ({
  className,
  ...props
}: ColorPickerFormatProps) => {
  const {
    hue,
    saturation,
    lightness,
    alpha,
    setHue,
    setSaturation,
    setLightness,
    setAlpha,
  } = useColorPicker();
  
  const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100);
  const hex = color.hex();

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    try {
      const newColor = Color(event.target.value);
      const [h, s, l] = newColor.hsl().array();

      setHue(h || 0);
      setSaturation(s);
      setLightness(l);
      setAlpha(newColor.alpha() * 100);
    } catch (error) {
      // Invalid color, ignore
    }
  };

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      <Input
        type="text"
        value={hex}
        onChange={handleChange}
        className="h-8 flex-1 text-xs bg-white/5 border-white/20"
        placeholder="#000000"
      />
      <ColorPickerEyeDropper />
    </div>
  );
};

export type ColorPickerEyeDropperProps = HTMLAttributes<HTMLButtonElement>;

export const ColorPickerEyeDropper = ({
  className,
  ...props
}: ColorPickerEyeDropperProps) => {
  const {
    setHue,
    setSaturation,
    setLightness,
    setAlpha,
  } = useColorPicker();

  const handleEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        // @ts-ignore - EyeDropper is experimental
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        
        if (result?.sRGBHex) {
          const newColor = Color(result.sRGBHex);
          const [h, s, l] = newColor.hsl().array();

          setHue(h || 0);
          setSaturation(s);
          setLightness(l);
          setAlpha(newColor.alpha() * 100);
        }
      } catch (error) {
        console.error('Eye dropper error:', error);
      }
    } else {
      console.warn('EyeDropper API not supported in this browser');
    }
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      className={cn('h-8 w-8 p-0 bg-white/5 border-white/20 hover:bg-white/10', className)}
      onClick={handleEyeDropper}
      {...props}
    >
      <PipetteIcon className="h-4 w-4" />
    </Button>
  );
};