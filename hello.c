#include <stdio.h>


int findMax(int arr[], int size);


int main()
{
    
printf("Enter number of vals: \n");
    
int numVals;
    
scanf("%d", &numVals);
   
 int va[numVals];
   
 for(int i = 0; i < numVals; i++){
       
 int temp;
        
printf("Enter number %d: \n", i);
       
 scanf("%d", &temp);
        
va[i] = temp;
    
}

   
 int max = findMax(va, sizeof(va)/sizeof(int));
printf("Max is: %d \n", max);
return 0;

}


int findMax(int arr[], int size){
    
int max = arr[0];
for(int i = 0; i < size; i++){
if(arr[i] > max){
max = arr[i];
}	
}

return max;
    
    

}
