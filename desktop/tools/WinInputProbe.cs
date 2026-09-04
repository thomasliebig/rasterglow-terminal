using System;
using System.Runtime.InteropServices;
class WinInputProbe {
 [StructLayout(LayoutKind.Explicit,Size=20)] struct R {[FieldOffset(0)]public ushort T;[FieldOffset(4)]public int Down;[FieldOffset(8)]public ushort Repeat;[FieldOffset(10)]public ushort Vk;[FieldOffset(12)]public ushort Scan;[FieldOffset(14)]public char Ch;[FieldOffset(16)]public uint State;[FieldOffset(4)]public short X;[FieldOffset(6)]public short Y;[FieldOffset(8)]public uint Buttons;[FieldOffset(12)]public uint MouseState;[FieldOffset(16)]public uint Flags;}
 [DllImport("kernel32.dll")]static extern IntPtr GetStdHandle(int n);[DllImport("kernel32.dll")]static extern bool GetConsoleMode(IntPtr h,out uint m);[DllImport("kernel32.dll")]static extern bool SetConsoleMode(IntPtr h,uint m);[DllImport("kernel32.dll",SetLastError=true)]static extern bool ReadConsoleInputW(IntPtr h,[In,Out]R[] r,uint n,out uint c);
 static void Main(){var h=GetStdHandle(-10);uint m;GetConsoleMode(h,out m);SetConsoleMode(h,(m|0x98)&~0x240u);Console.WriteLine("READY {0:X}",m);var a=new R[1];uint n;while(true){if(!ReadConsoleInputW(h,a,1,out n)){Console.WriteLine("ERROR {0}",Marshal.GetLastWin32Error());return;}if(n==0)continue;var r=a[0];if(r.T==1)Console.WriteLine("KEY {0} {1} {2} {3} {4}",r.Vk,r.Scan,r.Down,r.State,(int)r.Ch);else if(r.T==2)Console.WriteLine("MOUSE {0} {1} {2} {3}",r.X,r.Y,r.Buttons,r.Flags);}}
}
