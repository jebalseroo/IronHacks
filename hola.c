#include "stdio.h"
#include "math.h"

double producto = 1;

int main(int argc, char const *argv[]) {
     Wallis(1000000);
     Ramanujan(1);

  system("PAUSE");
}

int Wallis(int count){
  double pi = 1;
  int i;
  for (i = 1; i < count; i++) {
      double a = 2*i;
      pi = (pi*(a/(a-1))*(a/(a+1)));
  }
  pi = pi*2;
  printf("Pi = %2.18lf\n",pi);
  return ;
}

int Ramanujan (int count){
    double pi = 1;
    double b = ((2*(sqrt(2)))/9801);
    printf("b = %f\n", b);
    int i;
    for (i = 1; i < count; i++) {
        pi = (factorial((4*i))*(1103+(26390*i)))/(pow(factorial(i),4)*pow(396,(4*i)));
         }
    pi = pi*b;
    pi = 1/pi;
     printf("Pi = %2.18lf\n",pi);
    return ;
  }
int factorial(int n){
     int i = 1;
     for (i = n; i > 1; --i) {
         producto = producto * i;
      }
     return (producto);
     }


int factorial(int n){
     int i, producto = 1;
     for (i = n; i > 1; --i) {
         producto * = i;
      }
     return (producto);
     }
