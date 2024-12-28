'use client';
import { useGetApiResponse } from '@/core/api/getApiResponse';
import { useAppDispatch } from '@/core/redux/clientStore';
import { SelectorDataType } from '@/core/types/selectorTypes';
import SelectorV2 from '@/core/ui/components/Selector';
import {
  Button,
  DateSelector,
  FormCard,
  FormGroup,
  ImageInput,
  TextField,
} from '@/core/ui/zenlots/src';
import userApi from '@/modules/users/usersApi';
import {
  UserResponse,
  userSchema,
  UserSchemaType,
} from '@/modules/users/usersType';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { ZodError } from 'zod';

const Page = ({ params }: { params: { userId: string } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const genderOptions: Array<SelectorDataType> = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];
  useEffect(() => {
    if (params.userId) {
      dispatch(userApi.endpoints.getEachUser.initiate(params.userId));
    }
  }, [params, dispatch]);

  const toMutateAccountData = useGetApiResponse<UserResponse>(
    `getEachUser("${params.userId ? params.userId : undefined}")`
  );

  const onSubmit = async (values: UserSchemaType) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      var data = params.userId
        ? await Promise.resolve(
            dispatch(
              userApi.endpoints.updateUser.initiate({
                id: params.userId,
                ...values,
              })
            )
          )
        : await Promise.resolve(
            dispatch(userApi.endpoints.addUser.initiate(values))
          );

      if (Object.prototype.hasOwnProperty.call(data, 'data')) {
        router.push('/users/all');
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const validateForm = (values: UserSchemaType) => {
    try {
      userSchema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: any = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            const [key] = err.path;
            errors[key] = err.message;
          }
        });
        return errors;
      }
      return {};
    }
  };

  const formik = useFormik<UserSchemaType>({
    enableReinitialize: true,
    initialValues: {
      id: toMutateAccountData ? toMutateAccountData.username : '',
      username: toMutateAccountData ? toMutateAccountData.username : '',
      email: toMutateAccountData ? toMutateAccountData.email : '',
      is_staff: toMutateAccountData ? toMutateAccountData.is_staff : false,
      password: toMutateAccountData ? toMutateAccountData.password : '',
    },
    validateOnChange: true,
    validate: validateForm,
    onSubmit,
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      formik.setFieldValue('profile.avatar', e.target.files[0]);
    }
  };

  const handleDateChange = (selectedDay: Date | undefined) => {
    formik.setFieldValue(
      'profile.birth_date',
      selectedDay ? selectedDay.toISOString().split('T')[0] : ''
    );
  };

  return (
    <FormCard onSubmit={formik.handleSubmit} className="m-4">
      <FormGroup title="Basic Info">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="email"
              placeholder="eg. email@example.com"
              type="text"
              label="Email"
              className="flex-1"
              {...formik.getFieldProps('email')}
            />
            {!!formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>
          <div className="flex flex-col flex-1">
            <TextField
              id="username"
              placeholder="Username"
              type="text"
              label="Username"
              className="flex-1"
              {...formik.getFieldProps('username')}
            />
            {!!formik.errors.username && (
              <div className="text-red-500 text-sm">
                {formik.errors.username}
              </div>
            )}
          </div>
        </div>
      </FormGroup>
      <FormGroup title="Security">
        <div className="flex gap-2 mb-2 max-sm:flex-col">
          <div className="flex flex-col flex-1">
            <TextField
              id="password"
              type="password"
              label="Password"
              placeholder="•••••••••••••••"
              className="flex-1"
              {...formik.getFieldProps('password')}
            />
            {!!formik.errors.password && (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>
        </div>
      </FormGroup>
      <div className="flex justify-end gap-2 m-4">
        <Button
          text="Submit"
          className="h-8 w-fit"
          type="submit"
          isLoading={isLoading}
        />
        <Button
          text="Cancel"
          kind="danger"
          className="h-8 w-fit"
          buttonType="flat"
          onClick={() => {
            router.back();
          }}
        />
      </div>
    </FormCard>
  );
};

export default Page;
